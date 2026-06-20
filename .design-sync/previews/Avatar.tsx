import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "torch-glare";

// Canonical: a real photo loads into the circular frame.
export const WithImage = () => (
  <Avatar>
    <AvatarImage
      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces"
      alt="Marcus Reilly"
    />
    <AvatarFallback>MR</AvatarFallback>
  </Avatar>
);

// Fallback initials render when no/broken image source is provided.
export const Fallback = () => (
  <Avatar>
    <AvatarImage src="" alt="Sofia Alvarez" />
    <AvatarFallback>SA</AvatarFallback>
  </Avatar>
);

// A typical stacked avatar group for collaborators on a project.
export const Group = () => (
  <div style={{ display: "flex" }}>
    <Avatar className="ring-2 ring-white">
      <AvatarImage
        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces"
        alt="Hannah Lee"
      />
      <AvatarFallback>HL</AvatarFallback>
    </Avatar>
    <Avatar className="-ml-3 ring-2 ring-white">
      <AvatarImage
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces"
        alt="Marcus Reilly"
      />
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
    <Avatar className="-ml-3 ring-2 ring-white">
      <AvatarFallback>+5</AvatarFallback>
    </Avatar>
  </div>
);

// Sizes via className override (Avatar defaults to h-10 w-10).
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Avatar className="h-6 w-6 text-[10px]">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar className="h-10 w-10">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar className="h-14 w-14 text-lg">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </div>
);
