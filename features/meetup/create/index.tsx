"use client";

import dynamic from "next/dynamic";

const createFormModule = () => import("./components/CreateForm/index");

const CreateFormModal = dynamic(() => createFormModule().then((m) => m.CreateFormModal), {
	ssr: false,
});
const CreateFormView = dynamic(() => createFormModule().then((m) => m.CreateFormView), {
	ssr: false,
});

export { CreateFormView };
export default CreateFormModal;
