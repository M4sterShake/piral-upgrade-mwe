import React from 'react';
import { createInstance, Piral } from 'piral-core';

function App() {
  return (
    <div>
      <Piral instance={createInstance({ requestPilets: async () => [] })}>
        <div>Things are working!</div>
      </Piral>
    </div>
  );
}

export default App;
