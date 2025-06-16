USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sua_nhan_vien]    Script Date: 16/6/2025 2:40:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER     PROCEDURE [dbo].[sua_nhan_vien] (
	@MANV nchar(10),
	@HO nvarchar(40),
	@TEN nvarchar(10),
	@CMND nvarchar(10),
	@DIACHI nvarchar(100),
	@PHAI nvarchar(3),
	@SODT nvarchar(15),
	@MACN nvarchar(10),
	@TrangThaiXoa int
)
AS
BEGIN
	BEGIN TRY
		IF EXISTS (
			SELECT 1
			FROM NhanVien
			WHERE MANV = @MANV AND TrangThaiXoa = 1
		)
		BEGIN
			SELECT 5 as code, N'Không sửa đối tượng đã nghỉ viêc' as message
			RETURN 5
		END

		IF NOT EXISTS (
			SELECT 1
			FROM NGANHANG.dbo.ChiNhanh
			WHERE ChiNhanh.MACN = @MACN
		)
		BEGIN
			SELECT 1 as code, N'Không sửa thông tin chi nhánh nhân viên' as message
			RETURN 1
		END

		IF EXISTS (
			SELECT 1
			FROM NGANHANG.dbo.NhanVien
			WHERE (NhanVien.CMND = @CMND) AND (NhanVien.MANV != @MANV AND TrangThaiXoa = 0)
		)
		BEGIN
			SELECT 2 as code, N'Nhân viên này có số CMND trung với người còn đang làm việc ở Ngân hàng' as message
			RETURN 2
		END

		IF EXISTS (
			SELECT 1
			FROM NGANHANG.dbo.NhanVien
			WHERE (NhanVien.CMND = @CMND) AND (NhanVien.MANV != @MANV AND TrangThaiXoa = 0)
		)
		BEGIN
			SELECT 3 as code, N'Nhân viên này có số ĐT trung với người còn đang làm việc ở Ngân hàng' as message
			RETURN 3
		END
		BEGIN TRANSACTION
			UPDATE NGANHANG.dbo.NhanVien SET HO = @HO, TEN = @TEN, CMND = @CMND, DIACHI = @DIACHI, PHAI = @PHAI, SODT = @SODT, MACN = @MACN, TrangThaiXoa = @TrangThaiXoa
			WHERE  MANV = @MANV AND TrangThaiXoa = 0
		COMMIT TRANSACTION
		SELECT 0 as code, N'Sửa thông tin nhân viên thành công' as message
		RETURN 0
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION
		SELECT 4 as code, N'Có lỗi xảy ra, sửa thông tin nhân viên thất bại' as message
		RETURN 4
	END CATCH 
END

SELECT * FROM NhanVien WHERE CMND = '3742578499'
GO

