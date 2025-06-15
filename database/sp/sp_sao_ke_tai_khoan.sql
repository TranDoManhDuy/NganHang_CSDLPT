USE [NGANHANG]
GO

/****** Object:  StoredProcedure [dbo].[sp_sao_ke_tai_khoan]    Script Date: 6/11/2025 10:42:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER     PROC [dbo].[sp_sao_ke_tai_khoan]
    @SOTK_SAO_KE NCHAR(9),
    @NGAY_BAT_DAU DATETIME,
    @NGAY_KET_THUC DATETIME
AS
BEGIN

    -- Bảng chứa tất cả giao dịch của tài khoản (chưa tính số dư)
    DECLARE @BANGSAOKE TABLE
    (
        [SO DU TRUOC] MONEY,
        [NGAY] DATETIME,
        [LOAI GIAO DICH] NCHAR(3),
        [SO TIEN] MONEY,
        [SO DU SAU] MONEY
    )

    DECLARE @BANGNHANVIEN TABLE ([MANV] NCHAR(10))

    DECLARE @MCNHIENTAITB TABLE ([MACN] NCHAR(10))


    DECLARE @MCNHIENTAI NCHAR(10)

    INSERT INTO @MCNHIENTAITB
    EXEC [dbo].[sp_macn_ht] -- Stored procedure lấy mã chi nhánh hiện tại

    SELECT @MCNHIENTAI = MACN
    FROM @MCNHIENTAITB

    INSERT INTO @BANGSAOKE
    SELECT 0 AS [SO DU TRUOC],
           GRT.[NGAYGD] AS [NGAY],
           GRT.[LOAIGD] AS [LOAI GIAO DICH],
           GRT.[SOTIEN] AS [SO TIEN],
           0 AS [SO DU SAU]
    FROM [dbo].[GD_GOIRUT] AS GRT
    WHERE GRT.SOTK = @SOTK_SAO_KE

    INSERT INTO @BANGSAOKE
    SELECT 0 AS [SO DU TRUOC],
           CNT.[NGAYGD] AS [NGAY],
           N'CT' AS [LOAI GIAO DICH],
           CNT.[SOTIEN] AS [SO TIEN],
           0 AS [SO DU SAU]
    FROM [dbo].GD_CHUYENTIEN AS CNT
    WHERE CNT.SOTK_CHUYEN = @SOTK_SAO_KE

    INSERT INTO @BANGSAOKE
    SELECT 0 AS [SO DU TRUOC],
           CNT.[NGAYGD] AS [NGAY],
           N'NT' AS [LOAI GIAO DICH],
           CNT.[SOTIEN] AS [SO TIEN],
           0 AS [SO DU SAU]
    FROM [dbo].GD_CHUYENTIEN AS CNT
    WHERE CNT.SOTK_NHAN = @SOTK_SAO_KE


    IF @MCNHIENTAI != N'ALL'
    BEGIN

        INSERT INTO @BANGNHANVIEN
        SELECT NV.MANV
        FROM LINK0.[NGANHANG].[dbo].[NhanVien] AS NV
        WHERE NV.MACN != @MCNHIENTAI

        INSERT INTO @BANGSAOKE
        SELECT 0 AS [SO DU TRUOC],
               GRT.[NGAYGD] AS [NGAY],
               GRT.[LOAIGD] AS [LOAI GIAO DICH],
               GRT.[SOTIEN] AS [SO TIEN],
               0 AS [SO DU SAU]
        FROM
        (
            SELECT GRT.NGAYGD,
                   GRT.LOAIGD,
                   GRT.SOTIEN,
                   GRT.MANV
            FROM LINK0.[NGANHANG].[dbo].[GD_GOIRUT] AS GRT
            WHERE GRT.SOTK = @SOTK_SAO_KE
        ) AS GRT ,
        @BANGNHANVIEN AS NV -- Join với nhân viên chi nhánh khác
        WHERE GRT.MANV = NV.MANV


        INSERT INTO @BANGSAOKE
        SELECT 0 AS [SO DU TRUOC],
               CNT.[NGAYGD] AS [NGAY],
               'CT' AS [LOAI GIAO DICH],
               CNT.[SOTIEN] AS [SO TIEN],
               0 AS [SO DU SAU]
        FROM
        (
            SELECT CNT.NGAYGD,
                   CNT.SOTIEN,
                   CNT.MANV
            FROM LINK0.[NGANHANG].[dbo].[GD_CHUYENTIEN] AS CNT
            WHERE CNT.SOTK_CHUYEN = @SOTK_SAO_KE
        ) AS CNT ,
        @BANGNHANVIEN AS NV
        WHERE CNT.MANV = NV.MANV

        INSERT INTO @BANGSAOKE
        SELECT 0 AS [SO DU TRUOC],
               CNT.[NGAYGD] AS [NGAY],
               'NT' AS [LOAI GIAO DICH],
               CNT.[SOTIEN] AS [SO TIEN],
               0 AS [SO DU SAU]
        FROM
        (
            SELECT CNT.NGAYGD,
                   CNT.SOTIEN,
                   CNT.MANV
            FROM LINK0.[NGANHANG].[dbo].[GD_CHUYENTIEN] AS CNT
            WHERE CNT.SOTK_NHAN = @SOTK_SAO_KE
        ) AS CNT ,
        @BANGNHANVIEN AS NV
        WHERE CNT.MANV = NV.MANV
    END


    DECLARE @SODU MONEY
    SELECT @SODU = SODU
    FROM dbo.TaiKhoan
    WHERE SOTK = @SOTK_SAO_KE;


    -- Bảng tạm để lưu giao dịch đã lọc theo thời gian và sắp xếp
    DECLARE @TEMP_SAOKE TABLE
    (
        [NGAY] DATETIME,
        [LOAI GIAO DICH] NCHAR(3),
        [SO TIEN] MONEY,
        [STT] INT IDENTITY(1, 1)
    )

    INSERT INTO @TEMP_SAOKE
    (
        [NGAY],
        [LOAI GIAO DICH],
        [SO TIEN]
    )
    SELECT [NGAY],
           [LOAI GIAO DICH],
           [SO TIEN]
    FROM @BANGSAOKE
    ORDER BY [NGAY] ASC


    DECLARE @RESULT_SAOKE TABLE
    (
        [SO DU TRUOC] MONEY,
        [NGAY] DATETIME,
        [LOAI GIAO DICH] NCHAR(3),
        [SO TIEN] MONEY,
        [SO DU SAU] MONEY
    )


    DECLARE @SO_DU_DAU_KY MONEY
    SELECT @SO_DU_DAU_KY = @SODU - SUM(   CASE
                                              WHEN [LOAI GIAO DICH] IN ( 'GT', 'NT' ) THEN
                                                  [SO TIEN]  -- Gửi tiền/Nhận tiền: tăng số dư
                                              WHEN [LOAI GIAO DICH] IN ( 'RT', 'CT' ) THEN
                                                  -[SO TIEN] -- Rút tiền/Chuyển tiền: giảm số dư
                                              ELSE
                                                  0
                                          END
                                      )
    FROM @TEMP_SAOKE

    DECLARE @NGAY_GD DATETIME,
            @LOAI_GD NCHAR(3),
            @SO_TIEN_GD MONEY
    DECLARE @SO_DU_HIEN_TAI MONEY = @SO_DU_DAU_KY -- Bắt đầu từ số dư đầu kỳ

    -- Khai báo cursor để duyệt từng giao dịch theo thứ tự thời gian
    DECLARE gd_cursor CURSOR FOR
    SELECT [NGAY],
           [LOAI GIAO DICH],
           [SO TIEN]
    FROM @TEMP_SAOKE
    ORDER BY [NGAY],
             [STT] -- Sắp xếp theo ngày và STT

    -- Mở cursor và lấy record đầu tiên
    OPEN gd_cursor
    FETCH NEXT FROM gd_cursor
    INTO @NGAY_GD,
         @LOAI_GD,
         @SO_TIEN_GD

    -- Vòng lặp xử lý từng giao dịch
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Lưu số dư trước giao dịch
        DECLARE @SO_DU_TRUOC MONEY = @SO_DU_HIEN_TAI

        -- Tính số dư sau giao dịch
        SET @SO_DU_HIEN_TAI = @SO_DU_HIEN_TAI + CASE
                                                    WHEN @LOAI_GD IN ( 'GT', 'NT' ) THEN
                                                        @SO_TIEN_GD  -- Gửi tiền/Nhận tiền: cộng vào số dư
                                                    WHEN @LOAI_GD IN ( 'RT', 'CT' ) THEN
                                                        -@SO_TIEN_GD -- Rút tiền/Chuyển tiền: trừ khỏi số dư
                                                    ELSE
                                                        0
                                                END

        -- Thêm record vào bảng kết quả
        INSERT INTO @RESULT_SAOKE
        VALUES
        (   @SO_DU_TRUOC,   -- Số dư trước giao dịch
            @NGAY_GD,       -- Ngày giao dịch
            @LOAI_GD,       -- Loại giao dịch (GT/RT/CT/NT)
            @SO_TIEN_GD,    -- Số tiền giao dịch
            @SO_DU_HIEN_TAI -- Số dư sau giao dịch
        )

        -- Lấy record tiếp theo
        FETCH NEXT FROM gd_cursor
        INTO @NGAY_GD,
             @LOAI_GD,
             @SO_TIEN_GD
    END

    -- Đóng và giải phóng cursor
    CLOSE gd_cursor
    DEALLOCATE gd_cursor

  
    SELECT [SO DU TRUOC],   
           [NGAY],           
           [LOAI GIAO DICH],
           [SO TIEN],       
           [SO DU SAU]       
    FROM @RESULT_SAOKE
	WHERE NGAY BETWEEN @NGAY_BAT_DAU AND @NGAY_KET_THUC
    ORDER BY [NGAY]

END
GO

