USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_macn_ht]    Script Date: 16/6/2025 2:37:02 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE OR ALTER         PROC [dbo].[sp_macn_ht]
AS
BEGIN
    DECLARE @SO_CN INT,
            @MACN NCHAR(10)
    SELECT @SO_CN = COUNT(MACN)
    FROM [dbo].[ChiNhanh]

    IF @SO_CN = 1
    BEGIN
        SELECT CN.MACN
        FROM [dbo].[ChiNhanh] AS CN
        RETURN 1
    END
    ELSE
    BEGIN
        SELECT N'ALL' AS MACN
        RETURN 0
    END


END

GO

