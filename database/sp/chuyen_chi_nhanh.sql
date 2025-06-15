USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[chuyen_chi_nhanh]    Script Date: 6/11/2025 10:40:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[chuyen_chi_nhanh]
	@MANV nchar(10),
	@MACN_moi nvarchar(10),
	@MANV_moi nchar(10)
AS
BEGIN
	SET XACT_ABORT ON
	IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION
	BEGIN TRY
		DECLARE @MACN_cu nvarchar(10)
		SET @MACN_cu = (SELECT MACN FROM NGANHANG.dbo.NhanVien WHERE MANV = @MANV)
		-- kiểm tra ở site hiện tại, phải có nhân viên đó.
		IF NOT EXISTS (
			SELECT 1
			FROM NGANHANG.dbo.NhanVien
			WHERE NhanVien.MANV = @MANV and NhanVien.TrangThaiXoa = 0
		)
		BEGIN
			SELECT 1 as code, N'Nhân viên phải thuộc chi nhánh hiện tại và còn hoạt động' as message
			RETURN 1
		END

		IF NOT EXISTS (
			SELECT 1
			FROM LINK0.NGANHANG.dbo.ChiNhanh as CN
			WHERE CN.MACN = @MACN_moi AND @MACN_moi != @MACN_cu
		)
		BEGIN
			SELECT 2 as code, N'Phải chuyển qua chi nhánh khác' as message
			RETURN 2
		END
		BEGIN TRANSACTION
			PRINT('CHUYEN NHAN VIEN')
			UPDATE LINK0.NGANHANG.dbo.NhanVien SET NhanVien.TrangThaiXoa = 1
			WHERE MANV = @MANV

			SELECT * INTO #tmp
			FROM LINK0.NGANHANG.dbo.NhanVien
			WHERE NhanVien.MANV = @MANV
			
			INSERT INTO LINK0.NGANHANG.dbo.NhanVien (MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN, TrangThaiXoa)
			SELECT @MANV_moi, HO, TEN, CMND, DIACHI, PHAI, SODT, @MACN_moi, 0
			FROM #tmp
		COMMIT TRANSACTION
		SELECT 0 as code, N'Chuyển nhân viên thành công' as message
	END TRY
	BEGIN CATCH 
		
		SELECT 
        1 AS code,
        N'Điều chuyển nhân viên không thành công' AS message,
        ERROR_MESSAGE() AS error_message,
        ERROR_NUMBER() AS error_number,
        ERROR_SEVERITY() AS error_severity,
        ERROR_STATE() AS error_state,
        ERROR_LINE() AS error_line,
        ERROR_PROCEDURE() AS error_procedure;
	END CATCH
END
GO

