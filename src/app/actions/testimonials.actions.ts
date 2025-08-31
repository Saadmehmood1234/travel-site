'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/model/Testimonial';
import { ITestimonial } from '@/model/Testimonial';

export async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw new Error('Could not fetch testimonials');
  }
}

export async function createTestimonial(formData: FormData) {
  try {
    await dbConnect();
    
    const testimonialData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      rating: Number(formData.get('rating')),
      title: formData.get('title') as string,
      comment: formData.get('comment') as string,
      image: formData.get('image') as string,
      destination: formData.get('destination') as string,
      date: formData.get('date') as string,
      verified: formData.get('verified') === 'on',
    };

    const newTestimonial = new Testimonial(testimonialData);
    await newTestimonial.save();
    
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');
    
    return { success: true, message: 'Testimonial created successfully' };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return { success: false, message: 'Could not create testimonial' };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    await dbConnect();
    
    const updateData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      rating: Number(formData.get('rating')),
      title: formData.get('title') as string,
      comment: formData.get('comment') as string,
      image: formData.get('image') as string,
      destination: formData.get('destination') as string,
      date: formData.get('date') as string,
      verified: formData.get('verified') === 'on',
    };

    await Testimonial.findByIdAndUpdate(id, updateData);
    
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');
    
    return { success: true, message: 'Testimonial updated successfully' };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, message: 'Could not update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await dbConnect();
    await Testimonial.findByIdAndDelete(id);
    
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');
    
    return { success: true, message: 'Testimonial deleted successfully' };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, message: 'Could not delete testimonial' };
  }
}