
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { mintNFT } from '@/utils/nftUtils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ethers } from 'ethers';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  price: z.string().refine((val) => {
    try {
      const price = ethers.utils.parseEther(val);
      return price.gt(0);
    } catch (e) {
      return false;
    }
  }, {
    message: "Please enter a valid price in ETH.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const MintNFT = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: '0.01',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      await mintNFT({
        name: values.name,
        description: values.description,
        image: values.image,
        price: values.price
      });
      
      toast({
        title: "NFT Created!",
        description: "Your NFT has been successfully minted and listed for sale.",
      });
      
      // Reset the form
      form.reset();
      setPreviewImage('');
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Unable to mint your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('image', url);
    setPreviewImage(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <span className="text-nft-primary">Mint</span> New NFT
      </h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NFT Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter NFT name" {...field} className="nft-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your NFT" 
                              className="nft-input min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (ETH)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.001" 
                              min="0.001" 
                              placeholder="0.01" 
                              className="nft-input" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              className="nft-input"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleImageChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-4">
                      <p className="text-sm mb-2">Image Preview</p>
                      <div className="border border-gray-200 rounded-lg aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="NFT Preview" 
                            className="object-contain w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image+URL';
                            }}
                          />
                        ) : (
                          <div className="text-nft-muted text-sm">
                            Preview will appear here
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="nft-button w-full mt-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Minting...
                    </>
                  ) : (
                    'Mint NFT'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MintNFT;
