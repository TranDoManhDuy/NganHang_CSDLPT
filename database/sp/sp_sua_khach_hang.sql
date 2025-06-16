USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_sua_khach_hang]    Script Date: 16/6/2025 2:38:12 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[sp_sua_khach_hang]
    @CMND nchar(10),
    @HO nvarchar(50),
    @TEN nvarchar(50),
    @DIACHI nvarchar(100),
    @PHAI nvarchar(3),
    @SODT nvarchar(15)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN DISTRIBUTED TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM [NGANHANG].[dbo].[KhachHang] WHERE CMND = @CMND)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 0 AS code, N'Khách hàng không tồn tại' AS message;
            RETURN 0;
        END

        UPDATE [NGANHANG].[dbo].[KhachHang]
        SET 
            HO = @HO,
            TEN = @TEN,
            DIACHI = @DIACHI,
            PHAI = @PHAI,
            SODT = @SODT
        WHERE CMND = @CMND;

        COMMIT TRANSACTION;
        SELECT 1 AS code, N'Sửa khách hàng thành công' AS message;
        RETURN 1;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT 0 AS code, N'Sửa khách hàng thất bại' AS message;
        RETURN 0;
    END CATCH
END;
GO

