import React from "react";
import { Route } from "react-router-dom";
import Game from "./Game";

import Home from "./Home";

const App = () => (
  <div>
    <Route exact path="/" component={Home} />
    <Route exact path="/play" component={Game} />
  </div>
);

export default App;
