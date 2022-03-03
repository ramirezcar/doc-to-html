import "./index.scss";
import mammoth from "mammoth";
import { useState, useEffect } from "react";
import SuggestButton from "./components/SuggestButton";
import DocParser from "./components/DocParser";

export default function App() {
  
  return (
    <div className="App container">
      <DocParser />
    </div>
  );
}
