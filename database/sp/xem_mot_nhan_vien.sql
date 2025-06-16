USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[xem_mot_nhan_vien]    Script Date: 16/6/2025 2:40:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER       PROCEDURE [dbo].[xem_mot_nhan_vien]
	@MANV nchar(10)
AS
BEGIN
	IF EXISTS (
		SELECT 1
		FROM NGANHANG.dbo.NhanVien
		WHERE MANV = @MANV
	)
	BEGIN
		SELECT *
		FROM NGANHANG.dbo.NhanVien
		WHERE MANV = @MANV
		RETURN 1;
	END
	ELSE
	BEGIN
		SELECT *
		FROM LINK0.NGANHANG.dbo.NhanVien
		WHERE MANV = @MANV
		RETURN 1;
	END
END

-- Xem tất cả các chi nhánh
GO

