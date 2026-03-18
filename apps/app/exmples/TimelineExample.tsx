"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIndicator,
  TimelineSeparator,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
} from "@/components/Timeline";

export default function TimelineExample() {
  const [sizes] = useState<("S" | "M" | "L")[]>(["S", "M", "L"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-presentation-global-primary"
        )}
      >
        Timeline Preview
      </h1>

      {/* Vertical Timeline — All Variants */}
      <div className="flex flex-col gap-6 w-full">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Vertical — Status Variants
        </span>
        <Timeline orientation="vertical">
          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="completed" />
              <TimelineSeparator active />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Order Placed</TimelineHeading>
              <TimelineDescription>
                Your order has been confirmed and is being processed.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="completed" />
              <TimelineSeparator active />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Payment Verified</TimelineHeading>
              <TimelineDescription>
                Payment of $129.00 was successfully charged.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="active" />
              <TimelineSeparator />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>In Transit</TimelineHeading>
              <TimelineDescription>
                Package is on its way — expected delivery in 2 days.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="default" />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Delivered</TimelineHeading>
              <TimelineDescription>
                Awaiting delivery to your address.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      {/* Indicator Sizes */}
      <div className="flex flex-col gap-6 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Indicator Sizes
        </span>
        <div className="flex gap-8 items-start">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col gap-2 items-center">
              <span
                className={cn(
                  "text-xs",
                  "text-content-presentation-global-primary"
                )}
              >
                {size}
              </span>
              <TimelineIndicator variant="active" size={size} />
              <TimelineIndicator variant="completed" size={size} />
              <TimelineIndicator variant="error" size={size} />
              <TimelineIndicator variant="warning" size={size} />
              <TimelineIndicator variant="default" size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Icons */}
      <div className="flex flex-col gap-6 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Custom Icons
        </span>
        <Timeline orientation="vertical">
          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator
                variant="completed"
                icon={<i className="ri-git-commit-line" />}
              />
              <TimelineSeparator active />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Initial Commit</TimelineHeading>
              <TimelineDescription>feat: project scaffolding</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator
                variant="active"
                icon={<i className="ri-code-s-slash-line" />}
              />
              <TimelineSeparator />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Code Review</TimelineHeading>
              <TimelineDescription>PR #42 — Add authentication</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator
                variant="error"
                icon={<i className="ri-bug-line" />}
              />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Build Failed</TimelineHeading>
              <TimelineDescription>CI pipeline error on main branch</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      {/* Warning & Error States */}
      <div className="flex flex-col gap-6 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Warning & Error States
        </span>
        <Timeline orientation="vertical">
          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="completed" />
              <TimelineSeparator active />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Upload Started</TimelineHeading>
              <TimelineDescription>File upload initiated</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="warning" />
              <TimelineSeparator />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Slow Connection</TimelineHeading>
              <TimelineDescription>
                Upload speed reduced due to network conditions.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector>
              <TimelineIndicator variant="error" />
            </TimelineConnector>
            <TimelineContent>
              <TimelineHeading>Upload Failed</TimelineHeading>
              <TimelineDescription>
                Connection timed out. Please try again.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </>
  );
}
