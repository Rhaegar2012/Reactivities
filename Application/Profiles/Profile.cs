using System;
using System.Collections;
using System.Collections.Generic;
using Domain;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username {get; set;}
        public string DisplayName {get;set;}
        public string Bio {get; set;}
        public string Image {get;set;}
        public Boolean Following {get;set;}
        public int FollowersCount{get;set;}
        public int FollowingCount{get;set;}
        public ICollection<Photo> Photos {get;set;}
    }
}