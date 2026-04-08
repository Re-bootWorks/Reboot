"use client";

import dynamic from "next/dynamic";

const CreateFormModal = dynamic(
	() => import("./components/CreateForm").then((m) => m.CreateFormModal),
	{ ssr: false },
);

export { CreateFormView } from "./components/CreateForm";
export default CreateFormModal;
