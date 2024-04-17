"use client";
import React, { Suspense } from 'react';
import MyChoice from './../components/Choice/MyChoice';

export default function Choice() {
  return (
      <main>
        <Suspense>
          <MyChoice />
          </Suspense>
      </main>
  );
}
