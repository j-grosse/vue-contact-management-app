export const useUtils = () => {
    // Get status text based on days until contact
    const getContactStatus = (friend) => {
      const daysUntil = getDaysUntilContact(friend)
      
      if (daysUntil < 0) {
        return 'fällig'
      } else if (daysUntil === 0) {
        return 'heute'
      } else if (daysUntil <= 7) {
        return `in ${daysUntil} T.`
      } else {
        return 'geplant'
      }
    }
    
    // Get status class for styling
    const getContactStatusClass = (friend) => {
      const daysUntil = getDaysUntilContact(friend)
      
      if (daysUntil < 0) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      } else if (daysUntil === 0) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      } else if (daysUntil <= 7) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      } else {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      }
    }
    
    // Calculate days until next contact
    const getDaysUntilContact = (friend) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const nextContactDate = new Date(friend.nextContactDate)
      nextContactDate.setHours(0, 0, 0, 0)
      
      const diffTime = nextContactDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays
    }
    
    // Calculate days since last contact
    const getDaysSinceLastContact = (friend) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastContactDate = new Date(friend.lastContactDate)
      lastContactDate.setHours(0, 0, 0, 0)
      
      const diffTime = today - lastContactDate
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays
    }
  
    return {
      getContactStatus,
      getContactStatusClass,
      getDaysUntilContact,
      getDaysSinceLastContact
    }
  }