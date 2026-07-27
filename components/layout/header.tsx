"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { MessageCircleIcon, TrophyIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function Header({ isPro }: { isPro: boolean }) {
  const { isSignedIn } = useUser();

  return (
    <header>
      <div className="layout-container">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl space-x-2">
            Meetsy
          </Link>

          {isSignedIn && (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard">
                <Button variant={"ghost"} size={"sm"}>
                  Dashboard
                </Button>
              </Link>
              <Link href="/communities">
                <Button variant={"ghost"} size={"sm"}>
                  <UsersIcon className="size-4 text-primary" />
                  Communities
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant={"ghost"} size={"sm"}>
                  <MessageCircleIcon className="size-4 text-primary" />
                  Chat
                </Button>
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {isPro ? (
                <Badge className="flex items-center gap-2" variant="outline">
                  <TrophyIcon className="size-3 text-primary" /> Pro
                </Badge>
              ) : (
                "Free"
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9",
                  },
                }}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size={"sm"}>
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
