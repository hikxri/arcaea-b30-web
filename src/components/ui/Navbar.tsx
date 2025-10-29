import { Box, Center, Link, Tabs } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";

const buttons: Record<string, string>[] = [
  { name: "Home", link: "/" },
  { name: "Display", link: "/display" },
  { name: "Render", link: "/render" },
  { name: "Calibrate", link: "/calibrate" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Center marginBottom={"2"}>
      <Box>
        <Tabs.Root navigate={({ value }) => navigate(value)} value={location.pathname}>
          <Tabs.List>
            {buttons.map((button) => (
              <Tabs.Trigger value={button.link} key={`nav-${button.name}`} asChild>
                <Link unstyled href={"#" + button.link}>{button.name}</Link>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Box>
    </Center>
  );
}
