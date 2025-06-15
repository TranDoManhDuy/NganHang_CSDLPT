USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_tao_tai_khoan]    Script Date: 6/11/2025 10:42:39 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE OR ALTER             PROC [dbo].[sp_tao_tai_khoan]
    @CMND nchar(10),
    @macn nchar(10)
AS
BEGIN
    SET NOCOUNT ON
    -- Reset transaction context
    SET XACT_ABORT ON
    
    DECLARE @STATUS1 INT = 0,
            @STATUS2 INT = 0,
            @MAXSTK NCHAR(9),
            @COUNT INT = 0
            
    DECLARE @TABLEKHACHHANG TABLE(
        [CMND] NCHAR(10),
        [HO] NVARCHAR(50),
        [TEN] NVARCHAR(10),
        [DIACHI] NVARCHAR(100),
        [PHAI] NVARCHAR(3),
        [NGAYCAP] DATE,
        [SODT] NVARCHAR(15),
        [MACN] NCHAR(10)
    )
    
    -- Kiểm tra và clear transaction nếu có
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION
    END
    
    BEGIN TRY
        INSERT INTO @TABLEKHACHHANG     
        EXEC [NGANHANG].[dbo].[sp_tim_khach_hang] @CMND = @CMND
        
        -- Kiểm tra có dữ liệu trong table variable không
        SELECT @COUNT = COUNT(*) FROM @TABLEKHACHHANG
        IF @COUNT > 0
            SET @STATUS1 = 1
        ELSE
            SET @STATUS1 = 0
            
    END TRY
    BEGIN CATCH
        SET @STATUS1 = 0
    END CATCH

    -- Kiểm tra chi nhánh
    IF EXISTS(SELECT [MACN] FROM [dbo].[ChiNhanh] WHERE [MACN] = @macn)
    BEGIN
        SET @STATUS2 = 1
    END
    
    -- Kiểm tra CMND không tồn tại
    IF @STATUS1 != 1
    BEGIN
        SELECT '0' AS code, N'CMND NÀY KHÔNG TỒN TẠI' AS message
        RETURN 0
    END
    
    -- Sửa logic: nếu CMND tồn tại (STATUS1=1) VÀ chi nhánh hợp lệ (STATUS2=1)
    IF (@STATUS1 = 1 AND @STATUS2 = 1)
    BEGIN
        BEGIN TRY
            -- Tạo số tài khoản mới
            SELECT @MAXSTK = ISNULL(MAX(TK.SOTK), '000000000')
            FROM LINK0.NGANHANG.[dbo].[TaiKhoan] AS TK
            
            SET @MAXSTK = CAST(CAST(@MAXSTK AS INT) + 1 AS nchar(9))
			SET @MAXSTK = REPLICATE('0', 9 - LEN(@MAXSTK)) + @MAXSTK
            
            -- Insert tài khoản mới
            INSERT INTO LINK0.[NGANHANG].[dbo].[TaiKhoan]
            ([SOTK], [CMND], [SODU], [MACN], [NGAYMOTK])
            VALUES
            (@MAXSTK, @CMND, 0, @macn, GETDATE())
            
            SELECT '1' AS code, N'TẠO TÀI KHOẢN THÀNH CÔNG' AS message, @MAXSTK AS SOTK
            
        END TRY
        BEGIN CATCH
            SELECT '0' AS code, 
                   N'TẠO TÀI KHOẢN THẤT BẠI: ' + ERROR_MESSAGE() AS message
        END CATCH
    END
    ELSE
    BEGIN
        SELECT '0' AS code, N'CHI NHÁNH KHÔNG HỢP LỆ' AS message
    END
END

GO

