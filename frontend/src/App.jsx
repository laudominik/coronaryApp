import logo from './logo.svg';
import './App.css';
import BrandNav from './nav/nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reconstruction from './reconstruction/Reconstruction';
import Generation from './generation/Generation';
import Description from './description/Description';
import Manual from './manual/Manual';

function App() {
  return (
    <div className="App">
      <BrandNav />
      <BrowserRouter>
        <Routes>
          <Route index element={<Description />} />
          <Route path="/reconstruction" element={<Reconstruction />} />
          <Route path="/generation" element={<Generation />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="*" element={<h1>Invalid page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
