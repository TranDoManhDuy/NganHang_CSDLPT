USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[xoa_nhan_vien]    Script Date: 6/11/2025 10:46:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[xoa_nhan_vien] (
	@MANV nchar(10)
)
AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION
			UPDATE NhanVien
			SET TrangThaiXoa = 1 WHERE NhanVien.MANV = @MANV
		COMMIT TRAN
		SELECT 0 as code, N'Vô hiệu hóa hoàn tất' as message
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION
		SELECT 1 as code, N'Không thể vô hiệu hóa' as message
	END CATCH
END

EXEC xoa_nhan_vien @MANV = 'NV000001'

-- Xem danh sách nhân viên
GO

