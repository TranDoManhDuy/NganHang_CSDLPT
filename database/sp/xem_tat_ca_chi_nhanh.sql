USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[xem_tat_ca_chi_nhanh]    Script Date: 16/6/2025 2:40:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER     PROCEDURE [dbo].[xem_tat_ca_chi_nhanh]
AS
BEGIN
	SELECT *
	FROM LINK0.NGANHANG.dbo.ChiNhanh
END
EXEC xem_tat_ca_chi_nhanh

-- CHẠY SP này ở chi nhánh thôi.
-- Chuyen chi nhanh
-- Chi co the chay tren site chu
GO

