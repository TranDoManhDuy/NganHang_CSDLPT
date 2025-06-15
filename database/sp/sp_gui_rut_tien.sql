USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_gui_rut_tien]    Script Date: 6/11/2025 10:41:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER       PROC [dbo].[sp_gui_rut_tien]
    @SOTK nchar(9),
    @LOAIGD nchar(10) = 'GT',
    @SOTIEN money,
    @MANV nchar(10)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    SET XACT_ABORT ON

    DECLARE @STT1 INT,
            @STT2 INT,
            @MCNTK NCHAR(9),
            @SODU MONEY
    DECLARE @MACN_NV NVARCHAR(10),
            @MACN_CN NVARCHAR(10)

    DECLARE @KETQUATIMTK TABLE
    (
        [SOTK] NCHAR(9),
        [CMND] NCHAR(10),
        [SODU] MONEY,
        [MACN] NCHAR(10),
        [NGAYMOTK] DATETIME
    )

    DECLARE @KETQUAXEMNV TABLE
    (
        [MANV] NVARCHAR(10),
        [HO] NVARCHAR(40),
        [TEN] NVARCHAR(10),
        [CMND] NVARCHAR(10),
        [DIACHI] NVARCHAR(100),
        [PHAI] NVARCHAR(3),
        [SODT] NVARCHAR(15),
        [MACN] NVARCHAR(10),
        [TrangThaiXoa] INT,
        [rowguid] uniqueidentifier
    )

    INSERT INTO @KETQUATIMTK
    EXEC @STT1 = [dbo].[sp_tim_TK_theo_sotk] @SOTK

    INSERT INTO @KETQUAXEMNV
    EXEC @STT2 = [dbo].[xem_mot_nhan_vien] @MANV

    SELECT @MACN_CN = [MACN]
    FROM [dbo].[ChiNhanh]

    SELECT @MACN_NV = [MACN]
    FROM @KETQUAXEMNV

    SELECT @SODU = [SODU]  -- FIX: Sửa lại để lấy SODU thay vì @SOTIEN
    FROM @KETQUATIMTK

    -- Validation checks
    IF @STT1 = 0
    BEGIN
        SELECT 0 AS CODE, N'TÀI KHOẢN NÀY KHÔNG TỒN TẠI' AS MESSAGE
        RETURN 0
    END
    
    IF @STT2 = 0
    BEGIN
        SELECT 0 AS CODE, N'MÃ NHÂN VIÊN NÀY KHÔNG TỒN TẠI' AS MESSAGE
        RETURN 0
    END

    IF @MACN_NV != @MACN_CN
    BEGIN
        SELECT 0 AS CODE, N'MÃ NHÂN VIÊN NÀY KHÔNG THUỘC CHI NHÁNH NÀY' AS MESSAGE
        RETURN 0
    END

    IF @LOAIGD = 'RT' AND @SOTIEN > @SODU
    BEGIN
        SELECT 0 AS CODE, N'SỐ DƯ KHÔNG ĐỦ THỰC HIỆN GIAO DỊCH' AS MESSAGE
        RETURN 0
    END

    DECLARE @MACN_UPDATE NCHAR(10)
    SELECT @MACN_UPDATE = [MACN] FROM @KETQUATIMTK
    DECLARE @SQL NVARCHAR(500)
    DECLARE @JobName NVARCHAR(50) = 'Job_GuiRut_' + CONVERT(NVARCHAR(20), @@SPID) + '_' + FORMAT(GETDATE(), 'yyyyMMddHHmmss')

    -- Xây dựng câu lệnh SQL
    IF @MACN_UPDATE = 'BENTHANH'
    BEGIN
        IF @LOAIGD = N'GT'
            SET @SQL = 'UPDATE LINK1.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] + ' + CONVERT(NVARCHAR(20), @SOTIEN) + ' WHERE SOTK = ''' + LTRIM(RTRIM(@SOTK)) + ''''
        ELSE
            SET @SQL = 'UPDATE LINK1.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] - ' + CONVERT(NVARCHAR(20), @SOTIEN) + ' WHERE SOTK = ''' + LTRIM(RTRIM(@SOTK)) + ''''
    END

    IF @MACN_UPDATE = 'TANDINH'
    BEGIN
        IF @LOAIGD = 'GT'
            SET @SQL = 'UPDATE LINK2.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] + ' + CONVERT(NVARCHAR(20), @SOTIEN) + ' WHERE SOTK = ''' + LTRIM(RTRIM(@SOTK)) + ''''
        ELSE
            SET @SQL = 'UPDATE LINK2.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] - ' + CONVERT(NVARCHAR(20), @SOTIEN) + ' WHERE SOTK = ''' + LTRIM(RTRIM(@SOTK)) + ''''
    END

    BEGIN TRY
        -- CÁCH 1: Tách Job ra khỏi Distributed Transaction
        -- Tạo job trước khi bắt đầu transaction
        IF EXISTS (SELECT job_id FROM msdb.dbo.sysjobs_view WHERE name = @JobName)
            EXEC msdb.dbo.sp_delete_job @job_name = @JobName

        EXEC msdb.dbo.sp_add_job @job_name = @JobName, @start_step_id = 1
        EXEC msdb.dbo.sp_add_jobserver @job_name = @JobName, @server_name = @@SERVERNAME
        EXEC msdb.dbo.sp_add_jobstep @job_name = @JobName,
                                     @step_id = 1,
                                     @step_name = 'Update Balance',
                                     @command = @SQL,
                                     @server = @@SERVERNAME,
                                     @database_name = 'NGANHANG'

        -- Bắt đầu transaction chỉ để insert log
        BEGIN TRANSACTION
        
        INSERT LINK0.[NGANHANG].[dbo].[GD_GOIRUT]
        (
            [SOTK],
            [LOAIGD],
            [NGAYGD],
            [SOTIEN],
            [MANV]
        )
        VALUES
        (@SOTK, @LOAIGD, GETDATE(), @SOTIEN, @MANV)

        COMMIT TRANSACTION

        -- Chạy job sau khi commit transaction
        EXEC msdb.dbo.sp_start_job @job_name = @JobName

        SELECT 1 AS CODE, N'GỬI RÚT TIỀN THÀNH CÔNG' AS MESSAGE
        RETURN 1

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION

        -- Cleanup job nếu có lỗi
        IF EXISTS (SELECT job_id FROM msdb.dbo.sysjobs_view WHERE name = @JobName)
            EXEC msdb.dbo.sp_delete_job @job_name = @JobName

        SELECT 0 AS CODE, N'GỬI RÚT TIỀN THẤT BẠI: ' + ERROR_MESSAGE() AS MESSAGE
        RETURN 0
    END CATCH
END

GO

