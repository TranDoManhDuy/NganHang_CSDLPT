USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_tim_khach_hang_theo_macn]    Script Date: 16/6/2025 2:39:07 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER   PROCEDURE [dbo].[sp_tim_khach_hang_theo_macn]
    @MACN nchar(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Kiểm tra mã chi nhánh hợp lệ
        IF @MACN NOT IN ('BENTHANH', 'TANDINH')
        BEGIN
            RETURN 0; -- Mã chi nhánh không hợp lệ
        END

        -- Thực hiện truy vấn theo mã chi nhánh
        IF @MACN = 'BENTHANH'
        BEGIN
            SELECT 
              [HO]
            , [TEN]
            , [DIACHI]
            , [PHAI]
            , [NGAYCAP]
            , [SODT]
            , [MACN]
            FROM [LINK1].[NGANHANG].[dbo].[KhachHang] 
            WHERE MACN = @MACN 
            ORDER BY HO, TEN;
        END
        ELSE -- TANDINH
        BEGIN
            SELECT 
              [HO]
            , [TEN]
            , [DIACHI]
            , [PHAI]
            , [NGAYCAP]
            , [SODT]
            , [MACN]
            FROM [LINK2].[NGANHANG].[dbo].[KhachHang] 
            WHERE MACN = @MACN 
            ORDER BY HO, TEN;
        END

        RETURN 1; 
    END TRY
    BEGIN CATCH
        RETURN 0; 
    END CATCH
END;
GO

