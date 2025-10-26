import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function CalibrationCanvas({ offset }: { offset: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const WIDTH = 200;
  const HEIGHT = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    document.fonts.ready.then(() => {
      loadFonts();
    });

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

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.moveTo(10, 60);
      ctx.lineTo(190, 60);
      ctx.stroke();

      ctx.moveTo(10, 37);
      ctx.lineTo(190, 37);
      ctx.stroke();

      ctx.font = "bold 30px MyriadPro";
      ctx.fillStyle = "#ffc7c7ff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Hello, world!", 100, 51 + offset);
    }
  });

  return (
    <Box ref={containerRef} justifyItems={"center"} alignItems={"center"} margin={"2"}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ maxWidth: "40vw" }}>
        Aw :( Canvas is not supported on your browser, the contents can't be rendered.
      </canvas>
    </Box>
  );
}
