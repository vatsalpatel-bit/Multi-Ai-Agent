
import PDFDocument from "pdfkit";

export const generatePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate incoming data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid PDF data");
      }

      if (!data.title || !Array.isArray(data.sections)) {
        throw new Error("PDF title and sections are required");
      }

      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 75,
          bottom: 70,
          left: 60,
          right: 60,
        },
        bufferPages: true,
        autoFirstPage: true,
        compress: true,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("error", reject);

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      const left = 60;
      const right = 60;
      const contentWidth = pageWidth - left - right;

      const bottomLimit =
        pageHeight - doc.page.margins.bottom;

      // Add a page only when the next block cannot fit.
      const ensureSpace = (requiredHeight) => {
        if (doc.y + requiredHeight > bottomLimit) {
          doc.addPage();
        }
      };

      // -----------------------------
      // DOCUMENT TITLE
      // -----------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(25)
        .fillColor("#172554");

      const titleHeight = doc.heightOfString(data.title, {
        width: contentWidth,
        align: "center",
      });

      ensureSpace(titleHeight + 20);

      doc.text(data.title, {
        width: contentWidth,
        align: "center",
      });

      doc.moveDown(0.7);

      // -----------------------------
      // DOCUMENT SUBTITLE
      // -----------------------------

      if (data.subtitle) {
        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#64748b");

        const subtitleHeight = doc.heightOfString(
          data.subtitle,
          {
            width: contentWidth,
            align: "center",
          }
        );

        ensureSpace(subtitleHeight + 20);

        doc.text(data.subtitle, {
          width: contentWidth,
          align: "center",
        });

        doc.moveDown(1);
      }

      // Title divider
      doc
        .moveTo(left, doc.y + 5)
        .lineTo(pageWidth - right, doc.y + 5)
        .lineWidth(1)
        .strokeColor("#cbd5e1")
        .stroke();

      doc.moveDown(1.5);

      // -----------------------------
      // DOCUMENT SECTIONS
      // -----------------------------

      data.sections.forEach((section, sectionIndex) => {
        if (!section || !section.heading) {
          return;
        }

        const points = Array.isArray(section.points)
          ? section.points.filter(
              (point) =>
                typeof point === "string" &&
                point.trim().length > 0
            )
          : [];

        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#1e3a8a");

        const headingHeight = doc.heightOfString(
          section.heading,
          {
            width: contentWidth,
          }
        );

        // Reserve enough room for the heading and first point.
        let firstPointHeight = 0;

        if (points.length > 0) {
          doc.font("Helvetica").fontSize(11);

          firstPointHeight = doc.heightOfString(
            points[0],
            {
              width: contentWidth - 22,
              lineGap: 4,
            }
          );
        }

        ensureSpace(
          headingHeight +
            firstPointHeight +
            (points.length > 0 ? 35 : 15)
        );

        // Section heading
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#1e3a8a");

        doc.text(section.heading, {
          width: contentWidth,
        });

        doc.moveDown(0.5);

        // Section bullet points
        points.forEach((point) => {
          doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("#334155");

          const bulletX = left + 5;
          const textX = left + 22;
          const textWidth = contentWidth - 22;

          const pointHeight = doc.heightOfString(
            point,
            {
              width: textWidth,
              lineGap: 4,
            }
          );

          // Keep the bullet and its text together.
          ensureSpace(pointHeight + 8);

          const currentY = doc.y;

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#2563eb")
            .text("•", bulletX, currentY, {
              lineBreak: false,
            });

          doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("#334155")
            .text(point, textX, currentY, {
              width: textWidth,
              lineGap: 4,
            });

          doc.moveDown(0.45);
        });

        // Divider between sections.
        // Skip it if there isn't enough space;
        // do not create a page just for a divider.
        if (sectionIndex !== data.sections.length - 1) {
          if (doc.y + 18 < bottomLimit) {
            doc
              .moveDown(0.5)
              .moveTo(left, doc.y)
              .lineTo(pageWidth - right, doc.y)
              .lineWidth(0.5)
              .strokeColor("#e2e8f0")
              .stroke();

            doc.moveDown(1);
          }
        }
      });

      // -----------------------------
      // HEADER AND FOOTER
      // -----------------------------

      // Capture the final page range after content generation.
      const pageRange = doc.bufferedPageRange();

      for (
        let pageIndex = pageRange.start;
        pageIndex < pageRange.start + pageRange.count;
        pageIndex++
      ) {
        doc.switchToPage(pageIndex);

        doc.save();

        const originalBottomMargin =
          doc.page.margins.bottom;

        const originalY = doc.y;

        // Allow footer text inside the reserved footer area.
        // This prevents PDFKit from automatically adding pages.
        doc.page.margins.bottom = 15;

        // Header
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#64748b")
          .text("Guru ai", left, 35, {
            lineBreak: false,
          });

        // Footer divider
        doc
          .moveTo(left, pageHeight - 55)
          .lineTo(pageWidth - right, pageHeight - 55)
          .lineWidth(0.5)
          .strokeColor("#cbd5e1")
          .stroke();

        // Footer text
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#64748b")
          .text(
            "Generated with Guru ai",
            left,
            pageHeight - 42,
            {
              lineBreak: false,
            }
          );

        // Page number
        doc.text(
          `Page ${pageIndex + 1}`,
          left,
          pageHeight - 42,
          {
            width: contentWidth,
            align: "right",
            lineBreak: false,
          }
        );

        // Restore original page settings.
        doc.page.margins.bottom = originalBottomMargin;
        doc.y = originalY;

        doc.restore();
      }

      // IMPORTANT:
      // Do not call addPage() after this point.
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
