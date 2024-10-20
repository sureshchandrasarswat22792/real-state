import React from 'react';
import { useSelector } from 'react-redux';

export default function About() {

  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div className='py-28 w-[80%] mx-auto'>
      <h1 className='text-4xl font-bold'>About {currentUser.username} Estate</h1>
      <p className='py-4 text-slate-500'>simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived
        not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged</p>
      <p className='py-4 text-slate-500'>that it has a more-or-less normal distribution
        of letters, as opposed to using 'Content here, content
        here', making it look like readable English. Many desktop
        publishing packages and web page editors now use
        Lorem Ipsum as their default model text</p>
      <p className='py-4 text-slate-500'>Contrary to popular belief, Lorem Ipsum is not simply random text.
        It has roots in a piece of classical Latin literature from 45 BC,
        making it over 2000 years old. Richard McClintock, a Latin professor
        at Hampden-Sydney College in Virginia, looked up one of the more
        obscure Latin words, consectetur, from a Lorem Ipsum passage,
        and going through the cites of the word in classical literature,
        discovered the undoubtable source</p>
    </div>
  )
}
