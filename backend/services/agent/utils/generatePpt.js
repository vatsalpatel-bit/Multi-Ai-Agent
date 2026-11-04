
import pptxgen from "pptxgenjs";

export const generatePPT = async (data) => {
  if (
    !data?.title ||
    !Array.isArray(data.slides) ||
    data.slides.length !== 6
  ) {
    throw new Error("Invalid presentation data");
  }

  for (const slide of data.slides) {
    if (
      !slide.title ||
      !Array.isArray(slide.points) ||
      slide.points.length < 4 ||
      slide.points.length > 6 ||
      !slide.points.every(
        (point) =>
          typeof point === "string" && point.trim().length > 0
      )
    ) {
      throw new Error("Invalid slide content");
    }
  }

  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "AI Presentation Generator";
  pptx.subject = data.subtitle || data.title;
  pptx.title = data.title;
  pptx.company = "AI Generated Presentation";
  pptx.lang = "en-US";

  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  const W = 13.333;
  const H = 7.5;

  const C = {
    navy: "14213D",
    blue: "2563EB",
    lightBlue: "EFF6FF",
    white: "FFFFFF",
    text: "263449",
    muted: "64748B",
    border: "E2E8F0",
  };

  // --------------------------------
  // COVER SLIDE
  // --------------------------------

  const cover = pptx.addSlide();

  cover.background = { color: C.navy };

  cover.addShape("rect", {
    x: 0,
    y: 0,
    w: 0.18,
    h: H,
    line: { color: C.blue, transparency: 100 },
    fill: { color: C.blue },
  });

  cover.addText("AI PRESENTATION", {
    x: 0.9,
    y: 1.5,
    w: 5,
    h: 0.4,
    fontFace: "Aptos",
    fontSize: 15,
    bold: true,
    charSpacing: 3,
    color: "93C5FD",
    margin: 0,
  });

  cover.addText(data.title, {
    x: 0.9,
    y: 2.2,
    w: 10.8,
    h: 1.8,
    fontFace: "Aptos Display",
    fontSize: 34,
    bold: true,
    color: C.white,
    breakLine: false,
    valign: "mid",
    margin: 0,
    fit: "shrink",
  });

  if (data.subtitle) {
    cover.addText(data.subtitle, {
      x: 0.95,
      y: 4.25,
      w: 9.5,
      h: 1,
      fontSize: 18,
      color: "CBD5E1",
      breakLine: false,
      valign: "top",
      margin: 0,
      fit: "shrink",
    });
  }

  cover.addShape("line", {
    x: 0.95,
    y: 5.65,
    w: 2,
    h: 0,
    line: { color: C.blue, width: 3 },
  });

  cover.addText("Generated with AI", {
    x: 0.95,
    y: 6.15,
    w: 4,
    h: 0.3,
    fontSize: 11,
    color: "94A3B8",
    margin: 0,
  });

  // --------------------------------
  // CONTENT SLIDES
  // --------------------------------

  data.slides.forEach((item, index) => {
    const slide = pptx.addSlide();

    slide.background = { color: C.white };

    // Top accent bar
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: W,
      h: 0.09,
      line: { color: C.blue, transparency: 100 },
      fill: { color: C.blue },
    });

    // Slide category
    slide.addText("PRESENTATION", {
      x: 0.65,
      y: 0.4,
      w: 4,
      h: 0.25,
      fontSize: 10,
      bold: true,
      charSpacing: 2,
      color: C.blue,
      margin: 0,
    });

    // Slide title
    slide.addText(item.title, {
      x: 0.65,
      y: 0.85,
      w: 12,
      h: 0.8,
      fontFace: "Aptos Display",
      fontSize: 27,
      bold: true,
      color: C.navy,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });

    // Title underline
    slide.addShape("line", {
      x: 0.65,
      y: 1.78,
      w: 1.1,
      h: 0,
      line: { color: C.blue, width: 2.5 },
    });

    // Bullet point cards
    const startY = 2.05;
    const rowHeight = 0.73;
    const gap = 0.08;

    item.points.forEach((point, pointIndex) => {
      const y = startY + pointIndex * (rowHeight + gap);

      // Card background
      slide.addShape("roundRect", {
        x: 0.65,
        y,
        w: 12.05,
        h: rowHeight,
        rectRadius: 0.08,
        line: {
          color: C.border,
          transparency: 35,
          width: 0.7,
        },
        fill: {
          color: C.lightBlue,
        },
      });

      // Bullet dot
      slide.addShape("ellipse", {
        x: 0.92,
        y: y + 0.28,
        w: 0.12,
        h: 0.12,
        line: { color: C.blue, transparency: 100 },
        fill: { color: C.blue },
      });

      // Point text
      slide.addText(point, {
        x: 1.25,
        y: y + 0.08,
        w: 11.05,
        h: rowHeight - 0.16,
        fontFace: "Aptos",
        fontSize: 16,
        color: C.text,
        margin: 0.02,
        valign: "mid",
        breakLine: false,
        fit: "shrink",
      });
    });

    // Footer divider
    slide.addShape("line", {
      x: 0.65,
      y: 6.85,
      w: 12.05,
      h: 0,
      line: {
        color: C.border,
        width: 0.8,
      },
    });

    slide.addText("Generated with AI", {
      x: 0.65,
      y: 6.98,
      w: 4,
      h: 0.2,
      fontSize: 9,
      color: C.muted,
      margin: 0,
    });

    slide.addText(`${index + 1} / ${data.slides.length}`, {
      x: 11.5,
      y: 6.98,
      w: 1.2,
      h: 0.2,
      fontSize: 9,
      color: C.muted,
      align: "right",
      margin: 0,
    });
  });

  // Return PowerPoint as a Node.js Buffer
  const buffer = await pptx.write({
    outputType: "nodebuffer",
  });

  return buffer;
};
