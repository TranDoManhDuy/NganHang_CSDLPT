USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_them_khach_hang]    Script Date: 6/11/2025 10:43:03 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_them_khach_hang]
    @CMND nchar(10),
    @HO nvarchar(50),
    @TEN nvarchar(50),
    @DIACHI nvarchar(100),
    @PHAI nvarchar(3),
    @SODT nvarchar(15),
    @MACN nchar(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN DISTRIBUTED TRANSACTION;

        -- Kiểm tra tồn tại CMND ở server chính
        IF EXISTS (SELECT 1 FROM [NGANHANG].[dbo].[KhachHang] WHERE CMND = @CMND)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS code, N'Khách hàng đã tồn tại' AS message;
            RETURN 0;
        END

        -- Kiểm tra tồn tại CMND ở chi nhánh khác
        IF EXISTS (SELECT 1 FROM [LINK0].[NGANHANG].[dbo].[KhachHang] WHERE CMND = @CMND)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS code, N'Khách hàng đã tồn tại' AS message;
            RETURN 0;
        END

        -- Kiểm tra mã chi nhánh hợp lệ
        IF NOT EXISTS (SELECT 1 FROM [NGANHANG].[dbo].[ChiNhanh] WHERE MACN = @MACN)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS code, N'Chi nhánh không tồn tại' AS message;
            RETURN 0;
        END

        -- Thêm khách hàng mới
        INSERT INTO [NGANHANG].[dbo].[KhachHang] 
            (CMND, HO, TEN, DIACHI, PHAI, NGAYCAP, SODT, MACN)
        VALUES 
            (@CMND, @HO, @TEN, @DIACHI, @PHAI, CAST(GETDATE() AS DATE), @SODT, @MACN);

        COMMIT TRANSACTION;
        SELECT 1 AS code, N'Thêm khách hàng mới thành công' AS message;
        RETURN 1;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT 0 AS code, N'Thêm khách hàng thất bại: ' + ERROR_MESSAGE() AS message;
        RETURN 0;
    END CATCH
END;

GO

