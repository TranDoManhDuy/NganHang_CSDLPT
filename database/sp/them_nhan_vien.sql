USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[them_nhan_vien]    Script Date: 6/11/2025 10:45:41 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[them_nhan_vien] (
	@MANV nchar(10),
	@HO nvarchar(40),
	@TEN nvarchar(10),
	@CMND nvarchar(10),
	@DIACHI nvarchar(100),
	@PHAI nvarchar(3),
	@SODT nvarchar(15),
	@MACN nvarchar(10)
)
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (
			SELECT 1
			FROM NGANHANG.dbo.ChiNhanh
			WHERE ChiNhanh.MACN = @MACN
		)
		BEGIN
			SELECT 1 as code, N'Nhân viên phải thuộc chi nhánh hiện tại' as message
			RETURN 1
		END
		IF EXISTS (
			SELECT 1
			FROM LINK0.NGANHANG.dbo.NhanVien
			WHERE NhanVien.CMND = @CMND AND NhanVien.TrangThaiXoa = 0
		)
		BEGIN
			SELECT 2 as code, N'Nhân viên này có số CMND, hoặc SĐT trùng với người còn đang làm việc ở Ngân hàng' as message
			RETURN 2
		END
		IF EXISTS (
			SELECT 1
			FROM LINK0.NGANHANG.dbo.NhanVien
			WHERE NhanVien.CMND = @CMND AND NhanVien.TrangThaiXoa = 0
		)
		BEGIN
			SELECT 3 as code, N'Nhân viên này có số điện thoại trùng với người còn đang làm việc ở Ngân hàng' as message
			RETURN 3
		END
		BEGIN TRANSACTION
			INSERT INTO NGANHANG.dbo.NhanVien (MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN, TrangThaiXoa)
			VALUES (@MANV, @HO, @TEN, @CMND, @DIACHI, @PHAI, @SODT, @MACN, 0)
		COMMIT TRANSACTION
		SELECT 0 as code, N'Thêm nhân viên thành công' as message
		RETURN 0
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION
		SELECT 4 as code, N'Có lỗi xảy ra, thêm nhân viên thất bại' as message
		RETURN 4
	END CATCH
END
GO

