USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_lay_tat_ca_khach_hang]    Script Date: 16/6/2025 2:36:53 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[sp_lay_tat_ca_khach_hang]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
              [HO]
            , [TEN]
            , [DIACHI]
            , [PHAI]
            , [NGAYCAP]
            , [SODT]
            , [MACN]
        FROM [LINK3].[NGANHANG].[dbo].[KhachHang]
        ORDER BY HO, TEN;

        RETURN 1; 
    END TRY
    BEGIN CATCH
        RETURN 0; 
    END CATCH
END;
GO

