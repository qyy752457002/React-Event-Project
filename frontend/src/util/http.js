import { QueryClient } from '@tanstack/react-query';

// 创建一个全局的 QueryClient 实例
export const queryClient = new QueryClient();

/*
    在 fetchEvents 函数中，signal, searchTerm, 和 max 是作为一个对象的属性传递的，
    而不是单独的参数。这意味着你可以选择性地传递这些属性，
    而不需要每次调用函数都传递所有的属性
*/

/*
    `signal` 参数是用来传递一个 `AbortSignal` 对象的。

    `AbortSignal` 是一个可以用来中止（或取消）异步操作的对象。它通常与 `AbortController` 一起使用。

    `AbortSignal` 对象可以在需要时传递给异步操作（比如 `fetch` 请求），以便在需要取消操作时中止该操作。

    当使用 `AbortSignal` 中止一个操作时，操作会被立即中止，并触发相应的事件（比如 `abort` 事件），
    然后可以通过监听这些事件来执行额外的操作，比如清理资源或进行错误处理。

    在这个函数中，`signal` 参数被传递给了 `fetch` 请求，以便在需要时中止请求。

    例如，如果在请求还未完成时用户执行了取消操作，
    可以调用 `AbortController` 的 `abort()` 方法来中止请求，从而避免不必要的网络传输和资源消耗。

    总之，`signal` 参数的作用是用来控制异步操作的执行，并在需要时中止该操作，以提高性能并避免不必要的资源消耗。

    *********************************************************************************
    很重要！！！signal 参数在是可选的，它可以被省略，如果不需要中止操作，则可以不传递该参数。
    *********************************************************************************
*/

// 获取事件列表，http://localhost:3000 由后台服务器的监听端口所决定，这儿设定的是3000
export async function fetchEvents({ signal, searchTerm, max }) {
  let url = 'http://localhost:3000/events';

  // 根据搜索条件和最大值构建请求 URL
  if (searchTerm && max) {
    url += '?search=' + searchTerm + '&max=' + max;
  } else if (searchTerm) {
    url += '?search=' + searchTerm;
  } else if (max) {
    url += '?max=' + max;
  }

  // 发送请求并处理响应
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

// 创建新事件的函数
export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

// 获取可选图片的函数
export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`http://localhost:3000/events/images`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

// 获取特定事件的函数
export async function fetchEvent({ id, signal }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

// 删除事件的函数
export async function deleteEvent({ id }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = new Error('An error occurred while deleting the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

// 更新事件的函数
export async function updateEvent({ id, event }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ event }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while updating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
