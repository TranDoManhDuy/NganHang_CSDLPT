USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_tim_TK_theo_sotk]    Script Date: 16/6/2025 2:39:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER         PROC [dbo].[sp_tim_TK_theo_sotk] @sotk CHAR(9)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @KETQUATIMTK TABLE
    (
        [SOTK] NCHAR(9),
        [CMND] NCHAR(10),
        [SODU] MONEY,
        [MACN] NCHAR(10),
        [NGAYMOTK] DATETIME
    )
    BEGIN TRY
        IF EXISTS (SELECT SOTK FROM TaiKhoan AS TK WHERE TK.SOTK = @sotk)
        BEGIN
            SELECT [SOTK],
                   [CMND],
                   [SODU],
                   [MACN],
                   [NGAYMOTK]
            FROM [dbo].[TaiKhoan]
            WHERE [SOTK] = @sotk
            RETURN 1
        END
        ELSE
        BEGIN
            INSERT INTO @KETQUATIMTK
            SELECT [SOTK],
                   [CMND],
                   [SODU],
                   [MACN],
                   [NGAYMOTK]
            FROM LINK0.NGANHANG.[dbo].[TaiKhoan] AS TK
            WHERE TK.[SOTK] = @sotk
			IF NOT EXISTS(SELECT 1 FROM @KETQUATIMTK) RETURN 0
			SELECT * FROM @KETQUATIMTK
            RETURN 1
        END
    END TRY
    BEGIN CATCH
        SELECT ERROR_MESSAGE() AS ErrorMessage,
               ERROR_NUMBER() AS ErrorNumber;
    END CATCH
END


GO

