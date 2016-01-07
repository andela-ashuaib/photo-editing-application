import os
from cStringIO import StringIO
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from .filters import FilterClass


def apply_filter(image, filters):
    """This applies the required filters to the image
    @params image(model class)
    @filters string
    return image instance of model class"""
    original = Image.open(image.image.path)
    image_type = original.format.lower()

    if original.mode not in ('L', 'RGB'):
        original = original.convert('RGB')

    image_object = FilterClass(original)
    effect = getattr(image_object, filters)()

    temp_handle = StringIO()
    effect.save(temp_handle, image_type)
    temp_handle.seek(0)

    suf = SimpleUploadedFile(os.path.split(image.image.name)[-1],
                             temp_handle.read(),
                             content_type='image/%s' % (image_type))

    image.filter_path.save('%s_filter.%s' % (os.path.splitext(suf.name)[0],
                                             image_type), suf, save=False)
    #Save image class before returning the image"""
    image.save(update_fields=['filter_path'])
    return image