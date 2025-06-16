USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_thong_ke_tai_khoan]    Script Date: 16/6/2025 2:41:24 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[sp_thong_ke_tai_khoan]
    @MACN nchar(10),
    @start_date DATE,
    @end_date DATE
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @Result TABLE (
            SOTK nchar(9),
            CMND nchar(10),
            SODU money,
            MACN nchar(10),
            NGAYMOTK datetime,
            HO nvarchar(50),
            TEN nvarchar(10),
            DIACHI nvarchar(100),
            PHAI nvarchar(3),
            SODT nvarchar(15)
        );

        IF @MACN NOT IN ('BENTHANH', 'TANDINH', 'ALL') OR @start_date > @end_date
        BEGIN
            SELECT 0 as code, N'Chi nhánh không tồn tại' as message
            RETURN 0;
        END

        DECLARE @FilteredTaiKhoan TABLE (
            SOTK nchar(9),
            CMND nchar(10),
            SODU money,
            MACN nchar(10),
            NGAYMOTK datetime
        );

        INSERT INTO @FilteredTaiKhoan (SOTK, CMND, SODU, MACN, NGAYMOTK)
        SELECT 
            t.SOTK, t.CMND, t.SODU, t.MACN, t.NGAYMOTK
        FROM [NGANHANG].[dbo].[TaiKhoan] t
        WHERE 
            (@MACN = 'ALL' AND t.MACN IN ('BENTHANH', 'TANDINH') 
            OR t.MACN = @MACN)
            AND t.NGAYMOTK BETWEEN @start_date AND @end_date;

        IF @MACN = 'BENTHANH'
        BEGIN
            INSERT INTO @Result
            SELECT 
                t.SOTK, t.CMND, t.SODU, t.MACN, t.NGAYMOTK,
                k.HO, k.TEN, k.DIACHI, k.PHAI, k.SODT
            FROM @FilteredTaiKhoan t
            LEFT JOIN [LINK1].[NGANHANG].[dbo].[KhachHang] k ON t.CMND = k.CMND
            WHERE t.MACN = 'BENTHANH';
        END
        ELSE IF @MACN = 'TANDINH'
        BEGIN
            INSERT INTO @Result
            SELECT 
                t.SOTK, t.CMND, t.SODU, t.MACN, t.NGAYMOTK,
                k.HO, k.TEN, k.DIACHI, k.PHAI, k.SODT
            FROM @FilteredTaiKhoan t
            LEFT JOIN [LINK2].[NGANHANG].[dbo].[KhachHang] k ON t.CMND = k.CMND
            WHERE t.MACN = 'TANDINH';
        END
        ELSE IF @MACN = 'ALL'
        BEGIN
            INSERT INTO @Result
            SELECT 
                t.SOTK, t.CMND, t.SODU, t.MACN, t.NGAYMOTK,
                k.HO, k.TEN, k.DIACHI, k.PHAI, k.SODT
            FROM @FilteredTaiKhoan t
            LEFT JOIN (
                SELECT CMND, HO, TEN, DIACHI, PHAI, SODT
                FROM [LINK1].[NGANHANG].[dbo].[KhachHang]
                UNION
                SELECT CMND, HO, TEN, DIACHI, PHAI, SODT
                FROM [LINK2].[NGANHANG].[dbo].[KhachHang]
            ) k ON t.CMND = k.CMND;
        END

        SELECT * FROM @Result ORDER BY HO, TEN;

        RETURN 1;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        PRINT 'Error: ' + @ErrorMessage + ', Severity: ' + CAST(@ErrorSeverity AS NVARCHAR) + ', State: ' + CAST(@ErrorState AS NVARCHAR);

        RETURN 0;
    END CATCH
END;
GO

