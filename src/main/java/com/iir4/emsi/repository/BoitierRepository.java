package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.Zone;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Boitier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoitierRepository extends JpaRepository<Boitier, Long> {
	@Query("select b from Boitier b where b.id in (select z.boitier.id from Zone z where z.id=?1)")
	List<Boitier> getByZone(Long id);
	
	@Query("Select boitiers from Boitier boitiers where boitiers not in (Select zones.boitier  from  Zone zones)")
    List<Boitier> boitiersDispo();
}
