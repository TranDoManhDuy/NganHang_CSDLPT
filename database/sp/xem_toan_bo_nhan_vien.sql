USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[xem_toan_bo_nhan_vien]    Script Date: 16/6/2025 2:40:39 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER     PROCEDURE [dbo].[xem_toan_bo_nhan_vien]
AS
BEGIN
	/**
		Nếu ở site chi nhánh, thì sẽ chỉ xem toàn bộ nhân viên chi nhánh đó.
		Nếu ở site chủ, sẽ có thể xem toàn bộ các chi nhánh
	*/
	SELECT *
	FROM NGANHANG.dbo.NhanVien
END

-- Xem một nhân viên
-- Tìm site cục bộ trước, ko thìm thấy thì về site chủ tìm.
GO

