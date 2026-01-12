"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";

export default function Page() {
  return (
    <div className="p-8 space-y-12 bg-background-presentation-body-primary min-h-screen">
      <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
        Tabs Component Demo
      </h1>

      {/* PresentationStyle Variant */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          PresentationStyle (Default)
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="PresentationStyle" size="M">
            <TabsTrigger variant="PresentationStyle" size="M" value="tab1">
              Overview
            </TabsTrigger>
            <TabsTrigger variant="PresentationStyle" size="M" value="tab2">
              Settings
            </TabsTrigger>
            <TabsTrigger variant="PresentationStyle" size="M" value="tab3">
              Analytics
            </TabsTrigger>
            <TabsTrigger variant="PresentationStyle" size="M" value="tab4" disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Overview content goes here.
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Settings content goes here.
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Analytics content goes here.
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* SystemStyle Variant */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          SystemStyle
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="SystemStyle" size="M">
            <TabsTrigger variant="SystemStyle" size="M" value="tab1">
              Dashboard
            </TabsTrigger>
            <TabsTrigger variant="SystemStyle" size="M" value="tab2">
              Projects
            </TabsTrigger>
            <TabsTrigger variant="SystemStyle" size="M" value="tab3">
              Team
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="SystemStyle" value="tab1">
            <div className="p-4 rounded-md bg-background-system-body-secondary">
              Dashboard content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="SystemStyle" value="tab2">
            <div className="p-4 rounded-md bg-background-system-body-secondary">
              Projects content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="SystemStyle" value="tab3">
            <div className="p-4 rounded-md bg-background-system-body-secondary">
              Team content goes here.
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Underline Variant */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          Underline
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="Underline" size="M">
            <TabsTrigger variant="Underline" size="M" value="tab1">
              Profile
            </TabsTrigger>
            <TabsTrigger variant="Underline" size="M" value="tab2">
              Account
            </TabsTrigger>
            <TabsTrigger variant="Underline" size="M" value="tab3">
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="Underline" value="tab1">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Profile content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="Underline" value="tab2">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Account content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="Underline" value="tab3">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Notifications content goes here.
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Pills Variant */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          Pills
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="Pills" size="M">
            <TabsTrigger variant="Pills" size="M" value="tab1">
              All
            </TabsTrigger>
            <TabsTrigger variant="Pills" size="M" value="tab2">
              Active
            </TabsTrigger>
            <TabsTrigger variant="Pills" size="M" value="tab3">
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="Pills" value="tab1">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              All items content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="Pills" value="tab2">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Active items content goes here.
            </div>
          </TabsContent>
          <TabsContent variant="Pills" value="tab3">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Archived items content goes here.
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Size Comparison */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          Size Comparison
        </h2>
        <div className="space-y-6">
          <div>
            <p className="typography-body-small-medium text-content-presentation-global-secondary mb-2">
              Size S (22px)
            </p>
            <Tabs defaultValue="tab1">
              <TabsList variant="PresentationStyle" size="S">
                <TabsTrigger variant="PresentationStyle" size="S" value="tab1">
                  Small
                </TabsTrigger>
                <TabsTrigger variant="PresentationStyle" size="S" value="tab2">
                  Tabs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="typography-body-small-medium text-content-presentation-global-secondary mb-2">
              Size M (28px) - Default
            </p>
            <Tabs defaultValue="tab1">
              <TabsList variant="PresentationStyle" size="M">
                <TabsTrigger variant="PresentationStyle" size="M" value="tab1">
                  Medium
                </TabsTrigger>
                <TabsTrigger variant="PresentationStyle" size="M" value="tab2">
                  Tabs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="typography-body-small-medium text-content-presentation-global-secondary mb-2">
              Size L (34px)
            </p>
            <Tabs defaultValue="tab1">
              <TabsList variant="PresentationStyle" size="L">
                <TabsTrigger variant="PresentationStyle" size="L" value="tab1">
                  Large
                </TabsTrigger>
                <TabsTrigger variant="PresentationStyle" size="L" value="tab2">
                  Tabs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary">
          With Icons
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="PresentationStyle" size="M">
            <TabsTrigger variant="PresentationStyle" size="M" value="tab1">
              <i className="ri-home-line mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger variant="PresentationStyle" size="M" value="tab2">
              <i className="ri-settings-3-line mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger variant="PresentationStyle" size="M" value="tab3">
              <i className="ri-user-line mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Home content with icon.
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Settings content with icon.
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-md bg-background-presentation-form-field-primary">
              Profile content with icon.
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
