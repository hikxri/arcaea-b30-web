import { Box } from "@chakra-ui/react";
import { memo, useEffect, useRef } from "react";
import { getDifficultyColor, getGrade, getPotentialColor, getSongJacket } from "../../lib/drawing";
import { toNumber } from "../../lib/validation";
import type { Difficulty } from "../../lib/types";
import { getAveragePlayPotential, getMaxPlayPotential } from "../../lib/calc";
import { getLocalOffset } from "../../lib/storageActions";
import { useOffsetContext } from "../../contexts/OffsetContext";

export type CanvasProps = {
  topEntries: Record<string, string>[];
  rows: number;
  username: string;
  potential: number;
  options: CanvasOptions;
  onRendered?: () => void;
};

export type CanvasOptions = {
  toggles: CanvasToggles;
  customize: CanvasCustomize;
};

export type CanvasToggles = {
  avg: boolean;
  max: boolean;
  solidBg: boolean;
};

export type CanvasCustomize = {
  bgColor: string;
};

function Canvas({ topEntries, rows, username, potential, options, onRendered }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let OFFSET = useOffsetContext().offset;
  if (OFFSET === null) {
    OFFSET = getLocalOffset();
  }

  const WIDTH = 1800;
  const HEIGHT = 460 + 272 * rows;
  const X_DIST = 335;
  const Y_DIST = 272;
  const NUM_COLS = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // wait for fonts to be loaded before drawing
    document.fonts.ready.then(() => {
      loadFonts();
    });

    // for some reason mobile browsers need this
    async function loadFonts() {
      await Promise.all([
        new FontFace("MyriadPro", "url('fonts/MyriadPro-Regular.ttf')").load(),
        new FontFace("MyriadPro", "url('fonts/MyriadPro-Bold.ttf')", { weight: "bold" }).load(),
        new FontFace("Nunito", "url('fonts/Nunito.ttf')").load(),
      ]);

      draw();
    }

    async function draw() {
      if (!ctx || !canvas) return;

      // solid background fill
      ctx.fillStyle = "#130921";
      // ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // image background
      // (TODO)

      // background rectangle
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(75, 343, X_DIST * (NUM_COLS - 1) + 284 + 18, Y_DIST * (rows - 1) + 230 + 18);
      ctx.globalAlpha = 1.0;

      // header
      ctx.font = "bold 70px MyriadPro";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      drawTextWithOutline("Top " + rows * NUM_COLS + " entries", WIDTH / 2, 150);

      // username
      if (username.length > 0) {
        let textWidth = ctx.measureText(username).width;
        textWidth /= 2;
        const midPoint = [WIDTH / 2, 264];

        ctx.beginPath();
        ctx.moveTo(midPoint[0] - textWidth, midPoint[1] + 40);
        ctx.lineTo(midPoint[0] - textWidth - 40, midPoint[1]);
        ctx.lineTo(midPoint[0] - textWidth, midPoint[1] - 40);
        ctx.lineTo(midPoint[0] + textWidth, midPoint[1] - 40);
        ctx.lineTo(midPoint[0] + textWidth + 40, midPoint[1]);
        ctx.lineTo(midPoint[0] + textWidth, midPoint[1] + 40);
        ctx.closePath();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#9696ab";
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = "#dedeeaff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "64px MyriadPro";
        drawTextWithOutline(username, midPoint[0], midPoint[1]);
      }

      // user potential
      if (potential > 0) {
        let textCoord: [number, number];
        if (username.length > 0) {
          let textWidth = ctx.measureText(username).width;
          textWidth /= 2;
          const leftPoint = [WIDTH / 2 - textWidth - 175, 264];
          ctx.beginPath();
          ctx.moveTo(leftPoint[0], leftPoint[1]);
          ctx.lineTo(leftPoint[0] + 45, leftPoint[1] + 45);
          ctx.lineTo(leftPoint[0] + 90, leftPoint[1]);
          ctx.lineTo(leftPoint[0] + 45, leftPoint[1] - 45);
          ctx.closePath();

          textCoord = [leftPoint[0] + 45, leftPoint[1]];
        } else {
          const midPoint = [WIDTH / 2, 264];
          ctx.beginPath();
          ctx.moveTo(midPoint[0] + 45, midPoint[1]);
          ctx.lineTo(midPoint[0], midPoint[1] - 45);
          ctx.lineTo(midPoint[0] - 45, midPoint[1]);
          ctx.lineTo(midPoint[0], midPoint[1] + 45);
          ctx.closePath();

          textCoord = [midPoint[0], midPoint[1]];
        }

        ctx.fillStyle = getPotentialColor(potential);
        ctx.fill();
        ctx.font = "48px MyriadPro";
        ctx.fillStyle = "#ffffff";
        drawTextWithOutline(String(potential), textCoord[0], textCoord[1]);
      }

      // b30 ptt
      if (options.toggles.avg) {
        ctx.font = "40px MyriadPro";
        ctx.textAlign = "right";
        const averagePtt = getAveragePlayPotential(topEntries);
        const averagePttText =
          topEntries.length === 30
            ? `Average play potential: ${averagePtt.toFixed(3)}`
            : `B${topEntries.length} play potential: ${averagePtt.toFixed(3)}`;
        drawTextWithOutline(averagePttText, 1690, 246);
      }

      // max ptt
      if (options.toggles.max) {
        ctx.font = "40px MyriadPro";
        ctx.textAlign = "right";
        const maxPtt = getMaxPlayPotential(topEntries.slice(0, 30));
        const maxPttText =
          topEntries.length === 30
            ? `Max play potential: ${maxPtt.toFixed(3)}`
            : `B30 play potential: ${maxPtt.toFixed(3)}`;
        drawTextWithOutline(maxPttText, 1690, 296);
      }
      ctx.textAlign = "center";

      // load song jackets
      const jackets = await Promise.all(
        topEntries.map((song) => getSongJacket(song["title"], song["diff"] as Difficulty))
      );

      // songs grid
      topEntries.forEach(async (song, index) => {
        const col = index % NUM_COLS;
        const row = Math.floor(index / NUM_COLS);

        // rectangle background
        ctx.fillStyle = index <= 29 ? "#9583a7" : "#6e6e6e";
        ctx.globalAlpha = 0.8;
        ctx.fillRect(84 + X_DIST * col, 352 + Y_DIST * row, 284, 230);
        ctx.globalAlpha = 1.0;

        // song index
        ctx.fillStyle = index <= 29 ? "#a57aba" : "#828282";
        ctx.fillRect(76 + X_DIST * col, 364 + Y_DIST * row, 84, 48);
        ctx.font = "bold 34px MyriadPro";
        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        drawTextWithShadow("#" + String(index + 1), 148 + X_DIST * col, 390 + Y_DIST * row);

        // play potential
        ctx.font = "40px MyriadPro";
        ctx.textAlign = "center";
        const pp = toNumber(song["pp"]).toFixed(2);
        drawTextWithOutline(pp, 136 + X_DIST * col, 442 + Y_DIST * row);

        // cc
        ctx.font = "28px MyriadPro";
        drawTextWithOutline(`(${toNumber(song["cc"]).toFixed(1)})`, 136 + X_DIST * col, 480 + Y_DIST * row);

        // draw song jacket
        const jacket = jackets[index];
        if (jacket) {
          ctx.drawImage(jacket, 188 + X_DIST * col, 370 + Y_DIST * row, 170, 170);
        } else {
          ctx.fillStyle = "#acacacff";
          ctx.fillRect(188 + X_DIST * col, 370 + Y_DIST * row, 170, 170);
        }

        // song difficulty level
        let leftPoint = [334, 352];
        ctx.beginPath();
        ctx.moveTo(leftPoint[0] + X_DIST * col, leftPoint[1] + Y_DIST * row); // <
        ctx.lineTo(leftPoint[0] + 34 + X_DIST * col, leftPoint[1] + 34 + Y_DIST * row); // v
        ctx.lineTo(leftPoint[0] + 34 * 2 + X_DIST * col, leftPoint[1] + Y_DIST * row); // >
        ctx.lineTo(leftPoint[0] + 34 + X_DIST * col, leftPoint[1] - 34 + Y_DIST * row); // ^
        ctx.closePath();
        
        ctx.strokeStyle = "#d6d6d6";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = getDifficultyColor(song["diff"] as Difficulty);
        ctx.fill();

        ctx.font = "bold 34px MyriadPro";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawTextWithShadow(song["level"], leftPoint[0] + 34 + X_DIST * col, leftPoint[1] + Y_DIST * row);

        // score
        ctx.fillStyle = "#291b39";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(210 + X_DIST * col, 516 + Y_DIST * row, 148, 24);
        ctx.globalAlpha = 1.0;

        ctx.font = "34px MyriadPro";
        ctx.textAlign = "right";
        drawTextWithOutline(
          toNumber(song["score"]).toLocaleString().replaceAll(",", "'"),
          356 + X_DIST * col,
          520 + Y_DIST * row
        );

        // grade
        leftPoint = [96, 522];

        ctx.beginPath();
        ctx.moveTo(leftPoint[0] + X_DIST * col, leftPoint[1] + Y_DIST * row); // <
        ctx.lineTo(leftPoint[0] + 23 + X_DIST * col, leftPoint[1] + 23 + Y_DIST * row); // v
        ctx.lineTo(leftPoint[0] + 23 + X_DIST * col + 30, leftPoint[1] + 23 + Y_DIST * row); // _
        ctx.lineTo(leftPoint[0] + 23 * 2 + X_DIST * col + 30, leftPoint[1] + Y_DIST * row); // >
        ctx.lineTo(leftPoint[0] + 23 + X_DIST * col + 30, leftPoint[1] - 23 + Y_DIST * row); // ^
        ctx.lineTo(leftPoint[0] + 23 + X_DIST * col, leftPoint[1] - 23 + Y_DIST * row); // -
        ctx.closePath();

        ctx.fillStyle = "#c7c7d3";
        ctx.fill();

        ctx.font = "36px MyriadPro";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawTextWithOutline(
          getGrade(toNumber(song["score"])),
          leftPoint[0] + 23 + X_DIST * col + 15,
          leftPoint[1] + Y_DIST * row + 2,
          "#e6dafeff"
        );

        // song name
        ctx.font = "30px MyriadPro";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const songName = song["title"];
        drawTextWithOutline(
          songName.length <= 20 ? songName : songName.slice(0, 17) + "...",
          92 + X_DIST * col,
          548 + Y_DIST * row
        );
      });

      console.log("done");
      if (onRendered) onRendered();
    }

    function drawTextWithOutline(text: string, x: number, y: number, color: string = "#ffffff") {
      if (!ctx || !canvas) return;
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.fillStyle = color;
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(text, x, y + (OFFSET ?? 0));
      ctx.fillText(text, x, y + (OFFSET ?? 0));
      ctx.restore();
    }

    function drawTextWithShadow(text: string, x: number, y: number) {
      if (!ctx || !canvas) return;
      ctx.save();
      ctx.shadowBlur = 2;
      ctx.shadowColor = "#000000";
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillText(text, x, y + (OFFSET ?? 0));
      ctx.restore();
    }
  });

  return (
    <Box ref={containerRef} justifyItems={"center"} alignItems={"center"} margin={"2"}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}
      style={{ maxWidth: "40vw" }}
      >
        Aw :( Canvas is not supported on your browser, the contents can't be rendered.
      </canvas>
    </Box>
  );
}

export default memo(Canvas);
