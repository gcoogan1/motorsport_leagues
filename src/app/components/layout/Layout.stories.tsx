import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./Layout";

// -- Meta Configuration -- //

const meta: Meta<typeof Layout> = {
  title: "App/Components/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;



// -- Stories -- //

type Story = StoryObj<typeof Layout>;

//  --> Dummy page to render within the layout
const DummyPage = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    This is the page content
  </div>
);

export const Default: Story = {
  decorators: [
    () => (
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DummyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
};
