USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_chuyen_tien]    Script Date: 6/11/2025 10:40:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER     PROC [dbo].[sp_chuyen_tien]
    @SOTK_CHUYEN NCHAR(9),
    @SOTIEN MONEY,
    @SOTK_NHAN NCHAR(9),
    @MANV NCHAR(10)
AS
BEGIN
    -- Thiết lập mức cô lập cao nhất cho giao tác phân tán
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    SET XACT_ABORT ON

    DECLARE @STT1 INT,
            @STT2 INT,
            @STT3 INT,
            @MCN NCHAR(9)

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
    EXEC @STT1 = [dbo].[sp_tim_TK_theo_sotk] @SOTK_CHUYEN

    INSERT INTO @KETQUATIMTK
    EXEC @STT2 = [dbo].[sp_tim_TK_theo_sotk] @SOTK_NHAN

    INSERT INTO @KETQUAXEMNV
    EXEC @STT3 = [dbo].[xem_mot_nhan_vien] @MANV

    IF @SOTK_CHUYEN = @SOTK_NHAN
    BEGIN
        SELECT '0' AS code,
               N'TK CHUYEN GIONG TK NHAN' AS message
        RETURN 0
    END

    IF @STT1 = 0
    BEGIN
        SELECT '0' AS code,
               N'TK CHUYỂN KHÔNG TỒN TẠI' AS message
        RETURN 0
    END

    IF @STT2 = 0
    BEGIN
        SELECT '0' AS code,
               N'TK NHẬN KHÔNG TỒN TẠI' AS message
        RETURN 0
    END

    IF @STT3 = 0
    BEGIN
        SELECT '0' AS code,
               N'MÃ NHÂN VIÊN NÀY KHÔNG TỒN TẠI' AS message
        RETURN 0
    END

    --kiểm tra đủ điều kiện để thực hiện chuyển tiền

    DECLARE @SODU_TKCHUYEN MONEY,
            @MACN_TK_CHUYEN NCHAR(10),
            @MACN_TK_NHAN NCHAR(10)

    SELECT @SODU_TKCHUYEN = [SODU],
           @MACN_TK_CHUYEN = [MACN]
    FROM @KETQUATIMTK
    WHERE [SOTK] = @SOTK_CHUYEN

    IF @SODU_TKCHUYEN < @SOTIEN
    BEGIN
        SELECT '0' AS code,
               N'SỐ DƯ KHÔNG ĐỦ ĐỂ THỰC HIỆN GIAO DỊCH' AS message
        RETURN 0
    END

    SELECT @MACN_TK_NHAN = [MACN]
    FROM @KETQUATIMTK
    WHERE [SOTK] = @SOTK_NHAN

    --UPDATE TK CHUYEN
    DECLARE @SQL1 NVARCHAR(500),
            @SQL2 NVARCHAR(500)
    DECLARE @SOTIEN_STR NVARCHAR(20) = CAST(@SOTIEN AS NVARCHAR(20))

    IF @MACN_TK_CHUYEN = 'BENTHANH'
    BEGIN
        SET @SQL1
            = 'UPDATE LINK1.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] - ' + @SOTIEN_STR + ' WHERE [SOTK] = '''
              + RTRIM(@SOTK_CHUYEN) + ''''
    END

    IF @MACN_TK_CHUYEN = 'TANDINH'
    BEGIN
        SET @SQL1
            = 'UPDATE LINK2.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] - ' + @SOTIEN_STR + ' WHERE [SOTK] = '''
              + RTRIM(@SOTK_CHUYEN) + ''''
    END

    -- UPDATE TK NHAN
    IF @MACN_TK_NHAN = 'BENTHANH'
    BEGIN
        SET @SQL2
            = 'UPDATE LINK1.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] + ' + @SOTIEN_STR + ' WHERE [SOTK] = '''
              + RTRIM(@SOTK_NHAN) + ''''
    END

    IF @MACN_TK_NHAN = 'TANDINH'
    BEGIN
        SET @SQL2
            = 'UPDATE LINK2.[NGANHANG].[dbo].[TaiKhoan] SET [SODU] = [SODU] + ' + @SOTIEN_STR + ' WHERE [SOTK] = '''
              + RTRIM(@SOTK_NHAN) + ''''
    END

    BEGIN TRY
        -- Bắt đầu giao tác phân tán với mức cô lập SERIALIZABLE
        BEGIN DISTRIBUTED TRANSACTION

        --JOB1 - Trừ tiền từ tài khoản chuyển
        IF EXISTS (SELECT job_id FROM msdb.dbo.sysjobs_view WHERE name = N'Job_1')
            EXEC msdb.dbo.sp_delete_job @job_name = N'Job_1'
        EXEC msdb.dbo.sp_add_job @job_name = N'Job_1', @start_step_id = 1
        EXEC msdb.dbo.sp_add_jobserver @job_name = N'Job_1',
                                       @server_name = @@SERVERNAME
        EXEC msdb.dbo.sp_add_jobstep @job_name = N'Job_1',
                                     @step_id = 1,
                                     @step_name = 'Update TK Chuyen',
                                     @command = @SQL1,
                                     @server = @@SERVERNAME,
                                     @database_name = 'NGANHANG'
        EXEC msdb.dbo.sp_start_job @job_name = N'Job_1'

        --JOB2 - Cộng tiền vào tài khoản nhận
        IF EXISTS (SELECT job_id FROM msdb.dbo.sysjobs_view WHERE name = N'Job_2')
            EXEC msdb.dbo.sp_delete_job @job_name = N'Job_2'
        EXEC msdb.dbo.sp_add_job @job_name = N'Job_2', @start_step_id = 1
        EXEC msdb.dbo.sp_add_jobserver @job_name = N'Job_2',
                                       @server_name = @@SERVERNAME
        EXEC msdb.dbo.sp_add_jobstep @job_name = N'Job_2',
                                     @step_id = 1,
                                     @step_name = 'Update TK Nhan',
                                     @command = @SQL2,
                                     @server = @@SERVERNAME,
                                     @database_name = 'NGANHANG'
        EXEC msdb.dbo.sp_start_job @job_name = N'Job_2'

        -- Ghi log giao dịch chuyển tiền
        INSERT LINK0.[NGANHANG].[dbo].[GD_CHUYENTIEN]
        (
            [SOTK_CHUYEN],
            [NGAYGD],
            [SOTIEN],
            [SOTK_NHAN],
            [MANV]
        )
        VALUES
        (@SOTK_CHUYEN, GETDATE(), @SOTIEN, @SOTK_NHAN, @MANV)

        -- Commit giao tác phân tán
        COMMIT TRANSACTION

        SELECT '1' AS code,
               N'CHUYỂN TIỀN THÀNH CÔNG' AS message
        RETURN 1

    END TRY
    BEGIN CATCH

        SELECT '0' AS code,
               N'CHUYỂN TIỀN THẤT BẠI: ' + ERROR_MESSAGE() AS message
        RETURN 0

    END CATCH
END

GO

