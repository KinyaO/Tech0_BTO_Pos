"use client";
import React, { Suspense } from 'react';
import QrcodeCashRegister3 from '../components/Qrcode/QrcodeCashRegister3';

export default function Shopping() {
  return (
      <main>
        <Suspense>
          <QrcodeCashRegister3 />
          </Suspense>
      </main>
  );
}