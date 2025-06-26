import { nav_headers } from "@/constants/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";
import { useAlert } from "@/context/alert-context";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    showAlert({
      title: "Logout",
      description: "Are you sure you want to logout?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: () => logout(),
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl">Blazor Template</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-row gap-3">
                {nav_headers(user).map(
                  (header) =>
                    header.condition && (
                      <NavigationMenuItem key={header.name}>
                        {header.action ? (
                          <Button onClick={handleLogout}>{header.name}</Button>
                        ) : (
                          <Link href={header.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              {header.name}
                            </NavigationMenuLink>
                          </Link>
                        )}
                      </NavigationMenuItem>
                    )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {nav_headers(user).map(
                  (header) =>
                    header.condition && (
                      <DropdownMenuItem key={header.name}>
                        {header.action ? (
                          <button
                            onClick={handleLogout}
                            className="w-full text-left"
                          >
                            {header.name}
                          </button>
                        ) : (
                          <Link href={header.href} className="w-full">
                            {header.name}
                          </Link>
                        )}
                      </DropdownMenuItem>
                    )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
