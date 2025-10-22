import { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  NumberInput,
  Text,
} from "@chakra-ui/react";

import { Tooltip } from "../ui/tooltip";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(2);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const data = JSON.parse(localStorage.getItem("data") ?? "[]");

  const COLS = 5;
  const ASPECT_RATIO = 1.414; // Portrait (A4-like)
  const PADDING = 20;
  const CELL_PADDING = 10;

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const maxHeight = window.innerHeight - 200;
    
    let width = containerWidth - 40;
    let height = width * ASPECT_RATIO;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height / ASPECT_RATIO;
    }
    
    setDimensions({ width, height });
  }, []);

  useEffect(() => {
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [calculateDimensions]);

  const getCellFromMouse = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    const cellWidth = (dimensions.width - PADDING * 2) / COLS;
    const cellHeight = (dimensions.height - PADDING * 2) / rows;

    const col = Math.floor((canvasX - PADDING) / cellWidth);
    const row = Math.floor((canvasY - PADDING) / cellHeight);

    if (col >= 0 && col < COLS && row >= 0 && row < rows) {
      const index = row * COLS + col;
      if (index < Math.min(data.length, COLS * rows)) {
        return index;
      }
    }
    return null;
  }, [dimensions, rows]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas || dimensions.width === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellWidth = (canvas.width - PADDING * 2) / COLS;
    const cellHeight = (canvas.height - PADDING * 2) / rows;
    const totalItems = Math.min(data.length, COLS * rows);

    for (let i = 0; i < totalItems; i++) {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const x = PADDING + col * cellWidth;
      const y = PADDING + row * cellHeight;

      const item = data[i];
      const isHovered = hoveredCell === i;

      // Cell background
      ctx.fillStyle = isHovered ? "#2d4059" : "#16213e";
      ctx.fillRect(
        x + CELL_PADDING / 2,
        y + CELL_PADDING / 2,
        cellWidth - CELL_PADDING,
        cellHeight - CELL_PADDING
      );

      // Border
      ctx.strokeStyle = isHovered ? "#00adb5" : "#0f3460";
      ctx.lineWidth = isHovered ? 3 : 1;
      ctx.strokeRect(
        x + CELL_PADDING / 2,
        y + CELL_PADDING / 2,
        cellWidth - CELL_PADDING,
        cellHeight - CELL_PADDING
      );

      // Text rendering
      const textX = x + CELL_PADDING + 5;
      const textY = y + CELL_PADDING + 5;
      const maxWidth = cellWidth - CELL_PADDING - 10;

      ctx.fillStyle = "#eeeeee";
      ctx.font = "bold 14px Arial";
      const title = item.title.length > 18 ? item.title.substring(0, 15) + "..." : item.title;
      ctx.fillText(title, textX, textY + 15, maxWidth);

      ctx.font = "12px Arial";
      ctx.fillStyle = "#00adb5";
      ctx.fillText(`Level ${item.level} | CC ${item.cc}`, textX, textY + 35, maxWidth);

      ctx.fillStyle = "#aaaaaa";
      ctx.fillText(`Score: ${item.score}`, textX, textY + 55, maxWidth);
      ctx.fillText(`PP: ${item.pp}`, textX, textY + 75, maxWidth);

      if (isHovered) {
        ctx.fillStyle = "#888888";
        ctx.font = "10px Arial";
        ctx.fillText(`Note: ${item.note} | PR: ${item.pr}`, textX, textY + 95, maxWidth);
      }
    }
  }, [dimensions, rows, hoveredCell]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cell = getCellFromMouse(e);
      setHoveredCell(cell);
    };

    const handleMouseLeave = () => {
      setHoveredCell(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [getCellFromMouse]);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-grid-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      
      // toast({
      //   title: "Downloaded!",
      //   description: "Canvas saved as PNG",
      //   status: "success",
      //   duration: 2000,
      // });
    });
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        // toast({
        //   title: "Copied!",
        //   description: "Canvas copied to clipboard",
        //   status: "success",
        //   duration: 2000,
        // });
      });
    } catch {
      // toast({
      //   title: "Error",
      //   description: "Failed to copy to clipboard",
      //   status: "error",
      //   duration: 2000,
      // });
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" p={6}>
      <VStack spaceY={6} maxW="1400px" mx="auto">
        <HStack w="full" justify="space-between" flexWrap="wrap" gap={4}>
          <HStack>
            <Text color="white" fontSize="lg" fontWeight="bold">
              Rows (5 × n):
            </Text>
            {/* <NumberInput
              value={rows}
              onChange={(_, val) => setRows(Math.max(1, val))}
              min={1}
              max={20}
              w="100px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput> */}
            <NumberInput.Root defaultValue={String(rows)} min={1} max={100} onValueChange={(val) => setRows(Math.max(1, val.valueAsNumber))}>
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
            <Text color="gray.400" fontSize="sm">
              ({COLS * rows} items)
            </Text>
          </HStack>

          <HStack>
            <Tooltip content="Download as PNG">
              <Button colorScheme="teal" onClick={downloadCanvas}>
                Download PNG
              </Button>
            </Tooltip>
            <Tooltip content="Copy to clipboard">
              <Button colorScheme="blue" onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
            </Tooltip>
          </HStack>
        </HStack>

        <Box
          ref={containerRef}
          w="full"
          display="flex"
          justifyContent="center"
          bg="gray.800"
          p={4}
          borderRadius="lg"
          boxShadow="xl"
        >
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              height: 'auto',
              cursor: 'pointer',
            }}
          />
        </Box>

        <Text color="gray.400" fontSize="sm">
          Hover over cells to see more details
        </Text>
      </VStack>
    </Box>
  );
}