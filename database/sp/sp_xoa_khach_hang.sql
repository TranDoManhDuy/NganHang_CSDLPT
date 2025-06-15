USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_xoa_khach_hang]    Script Date: 6/11/2025 10:45:03 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_xoa_khach_hang]
    @CMND nchar(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @code INT = 0;
    DECLARE @message NVARCHAR(200) = N'Thất bại';

    BEGIN TRY
        BEGIN DISTRIBUTED TRANSACTION;

        -- Kiểm tra nếu khách hàng có tài khoản => không cho xóa
        IF EXISTS (
            SELECT 1 FROM [NGANHANG].[dbo].[TaiKhoan] WHERE CMND = @CMND
            UNION
            SELECT 1 FROM [LINK0].[NGANHANG].[dbo].[TaiKhoan] WHERE CMND = @CMND
        )
        BEGIN
            SET @message = N'Không thể xóa vì khách hàng còn tài khoản.';
            ROLLBACK TRANSACTION;
            SELECT @code AS code, @message AS message;
            RETURN 0;
        END

        -- Kiểm tra nếu khách hàng không tồn tại
        IF NOT EXISTS (
            SELECT 1 FROM [NGANHANG].[dbo].[KhachHang] WHERE CMND = @CMND
        )
        BEGIN
            SET @message = N'Không tìm thấy khách hàng để xóa.';
            ROLLBACK TRANSACTION;
            SELECT @code AS code, @message AS message;
            RETURN 0;
        END

        -- Xóa khách hàng
        DELETE FROM [NGANHANG].[dbo].[KhachHang]
        WHERE CMND = @CMND;

        COMMIT TRANSACTION;
        SET @code = 1;
        SET @message = N'Xóa khách hàng thành công.';
        SELECT @code AS code, @message AS message;
        RETURN 1;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @message = ERROR_message();
        SELECT @code AS code, @message AS message;
        RETURN 0;
    END CATCH
END;
GO

