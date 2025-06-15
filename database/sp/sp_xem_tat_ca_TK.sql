USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_xem_tat_ca_TK]    Script Date: 6/11/2025 10:44:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE OR ALTER         PROC [dbo].[sp_xem_tat_ca_TK]
AS
BEGIN
	 IF( OBJECT_ID('[dbo].[TaiKhoan]', 'U') IS NOT NULL)
		BEGIN 
			SELECT 	[SOTK], [CMND], [SODU], [MACN], [NGAYMOTK]
			FROM [dbo].[TaiKhoan]
			RETURN 1
		END			
	ELSE
		BEGIN
			SELECT 	[SOTK], [CMND], [SODU], [MACN], [NGAYMOTK]
			FROM [LINK0].[dbo].[TaiKhoan]
			RETURN 2
		END
	RETURN 0
END
GO

