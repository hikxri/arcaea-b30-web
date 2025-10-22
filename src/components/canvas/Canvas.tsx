import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function Canvas({ rows }: { rows: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const WIDTH = 1800;
  const HEIGHT = 460 + 272 * rows;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    ctx.fillStyle = "#130921";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // draw background here
    // (TODO)
    
  });

  return (
    <Box ref={containerRef} justifyItems={"center"} margin={"2"}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: "60%" }}>
        Aw :( Canvas is not supported on your browser, the contents can't be rendered.
      </canvas>
    </Box>
  );
}
