"use client";
import React, { Suspense } from 'react';
import Printing from './../components/Print/Printing';

export default function Shopping() {
  return (
      <main>
        <Suspense>
          <Printing />
          </Suspense>
      </main>
  );
}