USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_tim_khach_hang]    Script Date: 16/6/2025 2:38:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER     PROCEDURE [dbo].[sp_tim_khach_hang]
    @CMND nchar(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (
            SELECT 1 
            FROM [NGANHANG].[dbo].[KhachHang] 
            WHERE CMND = @CMND
        )
        BEGIN
            SELECT 
            [CMND]
            ,  [HO]
            , [TEN]
            , [DIACHI]
            , [PHAI]
            , [NGAYCAP]
            , [SODT]
            , [MACN]
            FROM [NGANHANG].[dbo].[KhachHang] 
            WHERE CMND = @CMND 
            ORDER BY HO, TEN;
            RETURN 1;
        END

        SELECT
         [CMND]
        , [HO]
        , [TEN]
        , [DIACHI]
        , [PHAI]
        , [NGAYCAP]
        , [SODT]
        , [MACN]
        FROM [LINK3].[NGANHANG].[dbo].[KhachHang] 
        WHERE CMND = @CMND 
        ORDER BY HO, TEN;

        RETURN 1;
    END TRY
    BEGIN CATCH
        RETURN 0;
    END CATCH
END;
GO

