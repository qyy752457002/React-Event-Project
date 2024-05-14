import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate(); // 获取导航函数
  const { state } = useNavigation(); // 获取导航状态
  const submit = useSubmit(); // 获取提交函数
  const params = useParams(); // 获取路由参数

  /*
    在上面提供的代码中，queryKey 是一个数组，用于指定查询的唯一标识符。

    在这个例子中，queryKey 是一个包含两个元素的数组：['events', params.id]。
    
    这个数组用于标识查询的类型和查询所需的参数。

      1. 'events' 是查询的类型，表示我们正在获取events数据。

      2. params.id 是事件的特定标识符，用于唯一标识我们要获取的特定事件。

      3. signal 是 AbortSignal 对象的一部分，在 fetchEvent 函数中，用于控制和处理请求的取消。

    *** queryKey 数组的第一个元素指定了查询的类型，第二个元素指定了查询所需的参数。***

    ***  在 React Query 中，将 signal 作为 queryFn 参数传递，有助于在组件卸载或数据请求不再需要的情况下及时取消请求，避免浪费资源和潜在的内存泄漏。***

    这样设计可以使查询的缓存更有效，因为如果查询键不同，React Query 会认为这是不同的查询，从而缓存不同的数据。
  */

  // 使用 useQuery hook 获取事件数据
  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id], // 查询键
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }), // 查询函数
    staleTime: 10000 // 每隔10秒，'events' 查询键下对应 params.id 数据会被标记为 stale，客户端会向服务器请求 最新的 'events' 查询键下对应 params.id 的 数据
    // gcTime: 1000 // 数据会在缓存里面保留1秒
  });

  // // 乐观更新 (Optimistic Update)
  // const { mutate } = useMutation({ 
  //   mutationFn: updateEvent,
  //   // onMutate 代表 发起mutation之前执行一些操作
  //   onMutate: async (data) => {  // 这里的 data 是 handleSubmit() 函数里传入 mutate() 函数的 {id: params.id, event: formData}

  //       // 从 data 中获取 event，这里的 data 是 {id: params.id, event: formData}
  //       const newEvent = data.event; 
  //       // 等待取消 queryClient 中的 'events' 查询键下对应 params.id 的所有正在进行的查询
  //       await queryClient.cancelQueries({ queryKey: ['events', params.id] });

  //       // 从 queryClient 中获取 当前 'events' 查询键下对应 params.id 的数据
  //       const previousEvent = queryClient.getQueryData(['events', params.id]);
  //       // 使用 newEvent 更改 queryClient 中的 'events' 查询键下对应 params.id 的数据
  //       queryClient.setQueryData(['events', params.id], newEvent); 

  //       return { previousEvent }; // 返回 previousEvent，以便在 mutation 失败时回滚数据
  //   }, 

  //   // onError 代表 mutation 失败时执行一些操作
  //   onError: (error, data, context) => {
  //     // 使用 previousEvent 更改 queryClient 中的 'events' 查询键下对应 params.id 的数据
  //     queryClient.setQueryData(['events', params.id], context.previousEvent); 
  //   }, 

  //   // onSettled 代表 mutation 完成后执行的一些操作 (不管成功还是失败)
  //   onSettled: () => { 
  //     // 立即标记 'events' 查询键下对应 params.id 的数据为 stale，这会触发客户端向服务器请求最新的 'events' 查询键下对应 params.id 的数据
  //     queryClient.invalidateQueries(['events', params.id]);
  //   }
  // });

  // function handleSubmit(formData) {
  //   mutate({id: params.id, event: formData}); 
  //   navigate('../'); // 返回上一页
  // }

  // 提交表单数据的处理函数，将formData传递给后端服务器
  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' });
  }

  // 关闭模态框的处理函数
  function handleClose() {
    navigate('../'); // 返回上一页
  }

  let content;
  
  // 根据加载状态渲染内容
  if (isError) {
    content = (
      <>
        {/* 显示加载失败的错误提示 */}
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to load event. Please check your inputs and try again later.'
          } 
            /* 空值合并运算符 ??: 

              当左侧的值为 null 或 undefined 时返回默认值，不会考虑其他假值。
              对于 0 或 false，它们不会触发返回默认值的情况，而是会被视为有效的值。
              因此，只有在左侧的值为 null 或 undefined 时，?? 运算符才会返回默认值。
            */

            /* 逻辑或运算符 ||：

              当左侧的值为任何假值时，包括 0 和 false，都会返回默认值。
              所以，在左侧的值为 0 或 false 时，也会触发返回默认值的情况。
            */
        />
        <div className="form-actions">
          {/* 显示按钮以返回 */}
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  // 根据数据加载状态渲染内容
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>Sending data...</p>
        ) : (
          <>
            {/* 显示取消按钮，点击后回到上一页 */}
            <Link to="../" className="button-text"> 
              Cancel
            </Link>
            {/* 显示更新按钮 */}
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  // 将内容渲染到模态框中
  return <Modal onClose={handleClose}>{content}</Modal>;
}

/*

  为什么在 `loader` 中使用 `queryClient` 而不是直接使用 `useQuery`？？？

  主要是因为 `loader` 函数并不直接在 React 组件中运行，
  而是作为 React Router 提供的一部分 Data API，在路由切换时用来预加载数据。

  ### 区别和原因：

  1. **在路由层级加载数据：** 
    `loader` 是在 React Router 路由切换时调用的，用于提前获取某个路由页面需要的数据。
      在这个阶段，组件还没有被挂载或渲染。`useQuery` 只能在 React 组件中使用，
      但组件在调用 `loader` 时还未挂载，所以不能使用 `useQuery`。

  2. **数据预加载：**
    `loader` 在组件挂载之前预先加载数据，确保页面在用户导航到它时立即有数据可以展示，
      避免了加载时的闪烁或显示空状态。这种预加载数据的方式也可以利用 React Query 的缓存，从而避免重复请求并提高性能。

  3. **服务器端渲染和路由切换：** 
    `queryClient.fetchQuery` 可以直接在服务器或客户端导航时使用，以确保在路由切换时的数据一致性。
      对于服务器端渲染，这意味着可以在 HTML 中嵌入预先获取的数据。

  4. **数据缓存：**
    使用 `queryClient.fetchQuery` 可以直接操作 React Query 的缓存，这样即使数据已经被缓存，仍然可以返回它而不需要重复加载。
    这确保了数据获取的高效性和一致性。

  `loader` 是为路由切换和页面渲染设计的 API，通常用来在组件挂载之前就完成数据获取。
  `useQuery` 只适用于在挂载的 React 组件内部使用，因此它无法满足在 `loader` 中的需求。

*/

// 加载器函数，用于加载事件数据
// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }) {
  // 使用 fetchEvent 函数获取事件数据
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

// 动作函数，用于处理更新事件操作，会在表单提交时调用
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData(); // 获取表单数据
  const updatedEventData = Object.fromEntries(formData); // 将表单数据转换为对象形式
  await updateEvent({ id: params.id, event: updatedEventData }); // 使用 updatedEventData 更新 对应id 的event
  await queryClient.invalidateQueries(['events']); // 立即标记 'events' 查询键下的数据为 stale，这会触发客户端向服务器请求最新的 'events' 查询键下的数据
  return redirect('../'); // 重定向到上级路由
}
