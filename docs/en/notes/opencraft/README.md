---
title: OpenCraft
icon: solar:programming-bold
createTime: 2024/12/28 15:39:08
permalink: /en/opencraft/
---

### ==HunterX== Asynchronous Concurrent Web Scraping Framework

<NpmBadgeGroup
repo="YSH0313/HunterX"
items="stars,version,dm,license,source"
/>

[`HunterX`](https://github.com/YSH0313/HunterX)
It is an asynchronous concurrent framework that helps you quickly develop a web scraping application. It offers three priority queue message pipelines for you to choose from:

- `Memory Priority Mode`: No message queue service required, suitable for local development or scenarios that don't need distributed scraping.
- `RabbitMq Mode`: Uses `RabbitMq` as the priority queue for distributed collaborative scraping, improving scraping efficiency.
- `Redis Queue Mode`: Uses `Redis` as the priority queue, which is similar to `RabbitMq` and suitable for different queue usage scenarios.

It also provides many built-in features, allowing you to focus more on the web scraping logic itself. This makes your development code cleaner, reduces repetitive work, and makes the scraping code more standardized and easier to maintain.

Additionally, its concurrency features can also assist with some data processing tasks.

---

### ==Pacer== Asynchronous Backend Framework

<NpmBadgeGroup
repo="YSH0313/pacer"
items="stars,version,dm,license,source"
/>

[`Pacer`](https://github.com/YSH0313/pacer) It is a complete asynchronous backend framework designed specifically for `Python` engineers. It is a fully-featured web framework that provides many built-in functionalities to help developers quickly build high-quality web applications.

- `Full-Featured Framework`: `Pacer` offers a wide range of built-in features, such as an authentication system, admin backend, ORM (Object-Relational Mapping), form handling, caching, routing, session management, etc., allowing developers to quickly build web applications without reinventing the wheel.
- `Extensibility`: Although `Pacer` provides many built-in features, it also allows developers to extend and customize it according to their needs.
- `High Security`: `Pacer` emphasizes security in its design, providing mechanisms to prevent SQL injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and more, making it suitable for applications with high security requirements.
- `High Performance`: This is primarily due to the asynchronous nature of `asyncio`, which offers better performance and response speed. `asyncio` is a built-in asynchronous framework in Python that provides the basic tools for writing concurrent code, especially `coroutines` and the `event loop`. It allows you to perform I/O-bound tasks without blocking other parts of the program.

---
