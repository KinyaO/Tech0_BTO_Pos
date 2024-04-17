"use client";
import React, { Suspense } from 'react';
import BarcodeGenerator from './../components/Barcode/BarcodeGenerator';

export default function Shopping() {
  return (
      <main>
        <Suspense>
          <BarcodeGenerator />
          </Suspense>
      </main>
  );
}