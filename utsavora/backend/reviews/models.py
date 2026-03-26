from django.db import models

class Review(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name="review")

    rating = models.IntegerField()
    comment = models.TextField()
    role = models.CharField(max_length=20, default='USER')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.rating}"
